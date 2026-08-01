const prisma = require('../../db');
const { notifyNewLesson } = require('../../services/notifications');


const getMainTeacherId = async () => {
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  return teacher ? teacher.id : null;
};

const hasPermission = (user, resource) => {
  if (!user) return false;
  if (user.role === 'TEACHER') return true;
  if (user.role === 'ASSISTANT') {
    return user.permissions && user.permissions.includes(resource);
  }
  return false;
};


exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!hasPermission(req.user, 'DASHBOARD')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const courseFilter =
      userRole === 'TEACHER' ? { teacherId: userId, deletedAt: null } : { deletedAt: null };

    const courses = await prisma.course.findMany({
      where: courseFilter,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        price: true,
        pricingType: true,
        published: true,
        _count: { select: { enrollments: true } },
      },
    });

    const courseIds = courses.map((c) => c.id);

    let totalStudents = 0;
    let totalSales = 0;
    let totalProfit = 0;
    let activeSubscriptions = 0;
    let newJoinsThisWeek = 0;
    let salesThisMonth = 0;
    let recentActivity = [];

    if (courseIds.length > 0) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [enrollments, payments, quizAttempts, certificates] = await Promise.all([
        prisma.enrollment.findMany({
          where: { courseId: { in: courseIds } },
          include: {
            course: { select: { title: true, price: true, pricingType: true } },
            student: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.payment.findMany({
          where: { courseId: { in: courseIds }, status: 'PAID' },
          include: {
            course: { select: { title: true } },
            student: { select: { id: true, fullName: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.quizAttempt.findMany({
          where: {
            quiz: { courseId: { in: courseIds } },
            status: { in: ['SUBMITTED', 'GRADED'] },
          },
          include: {
            student: { select: { id: true, fullName: true } },
            quiz: { select: { title: true, courseId: true, course: { select: { title: true } } } },
          },
          orderBy: { submittedAt: 'desc' },
          take: 30,
        }),
        prisma.certificate.findMany({
          where: { courseId: { in: courseIds } },
          include: {
            student: { select: { id: true, fullName: true } },
            course: { select: { title: true } },
          },
          orderBy: { issuedAt: 'desc' },
          take: 30,
        }),
      ]);

      const uniqueStudents = new Set(enrollments.map((e) => e.studentId));
      totalStudents = uniqueStudents.size;

      totalSales = payments.reduce((sum, p) => sum + p.amount, 0);

      const paidEnrollmentKeys = new Set(
        payments.map((p) => `${p.studentId}-${p.courseId}`)
      );
      const legacySales = enrollments
        .filter((e) => !paidEnrollmentKeys.has(`${e.studentId}-${e.courseId}`))
        .reduce((sum, e) => sum + (e.course?.price || 0), 0);
      totalSales += legacySales;
      totalProfit = totalSales;

      activeSubscriptions = enrollments.filter(
        (e) =>
          e.course?.pricingType === 'SUBSCRIPTION' &&
          e.status === 'ACTIVE' &&
          (!e.expiresAt || new Date(e.expiresAt) > now)
      ).length;

      newJoinsThisWeek = enrollments.filter(
        (e) => new Date(e.createdAt) >= weekAgo
      ).length;

      salesThisMonth = payments
        .filter((p) => new Date(p.createdAt) >= monthStart)
        .reduce((sum, p) => sum + p.amount, 0);

      const activityItems = [
        ...enrollments.slice(0, 20).map((e) => ({
          type: 'enrollment',
          studentId: e.studentId,
          studentName: e.student?.fullName || 'طالب',
          courseId: e.courseId,
          courseTitle: e.course?.title,
          amount: e.course?.price || 0,
          timestamp: e.createdAt,
        })),
        ...payments.slice(0, 20).map((p) => ({
          type: 'payment',
          studentId: p.studentId,
          studentName: p.student?.fullName || 'طالب',
          courseId: p.courseId,
          courseTitle: p.course?.title,
          amount: p.amount,
          timestamp: p.createdAt,
        })),
        ...quizAttempts.map((a) => ({
          type: 'quiz',
          studentId: a.studentId,
          studentName: a.student?.fullName || 'طالب',
          courseId: a.quiz.courseId,
          courseTitle: a.quiz.course?.title,
          quizTitle: a.quiz.title,
          score: a.score,
          passed: a.passed,
          timestamp: a.submittedAt || a.createdAt,
        })),
        ...certificates.map((c) => ({
          type: 'certificate',
          studentId: c.studentId,
          studentName: c.student?.fullName || 'طالب',
          courseId: c.courseId,
          courseTitle: c.course?.title,
          timestamp: c.issuedAt,
        })),
      ];

      recentActivity = activityItems
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15);
    }

    res.status(200).json({
      courses,
      totalStudents,
      totalSales,
      totalProfit,
      activeSubscriptions,
      newJoinsThisWeek,
      salesThisMonth,
      recentActivity,
      recentEnrollments: recentActivity.filter((a) => a.type === 'enrollment'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.getTeacherCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!hasPermission(req.user, 'DASHBOARD')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const courses = await prisma.course.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        pricingType: true,
        published: true
      }
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch teacher courses' });
  }
};

exports.getTeacherCourseDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    if (!hasPermission(req.user, 'COURSE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId},
      include: {
        attachments: true
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const modules = await prisma.module.findMany({
      where: { courseId: courseId, deletedAt: null },
      orderBy: { position: 'asc' },
      include: {
        lessons: {
          orderBy: { position: 'asc' },
          select: { id: true, title: true, position: true, vimeoId: true }
        }
      }
    });

    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId,
        deletedAt: null
      },
      orderBy: { position: 'asc' }
    });

    res.status(200).json({
      course,
      modules,
      quizzes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!hasPermission(req.user, 'COURSE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      title,
      description,
      price,
      pricingType,
      gradeId,
      introVideoUrl,
      externalLink
    } = req.body;

    let thumbnailUrl = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      // Convert buffer to base64 data URL for serverless (no persistent disk)
      const file = req.files.thumbnail[0];
      const base64 = file.buffer.toString('base64');
      thumbnailUrl = `data:${file.mimetype};base64,${base64}`;
    }

    const course = await prisma.course.create({
      data: {
        teacherId: await getMainTeacherId() || userId,
        title,
        description,
        price: Number(price) || 0,
        pricingType,
        subscriptionPeriodDays: pricingType === 'subscription' ? 30 : null,
        thumbnailUrl,
        gradeId,
        introVideoUrl: introVideoUrl || null,
        externalLink: externalLink || null,
        published: true // auto publish or wait? let's make it true for now
      }
    });

    if (req.files && req.files.attachments && req.files.attachments.length > 0) {
      const attachmentRecords = req.files.attachments.map(file => {
        const base64 = file.buffer.toString('base64');
        return {
          courseId: course.id,
          fileName: file.originalname,
          fileUrl: `data:${file.mimetype};base64,${base64}`,
          fileSize: file.size
        };
      });

      await prisma.courseAttachment.createMany({
        data: attachmentRecords
      });
    }

    res.status(201).json({ id: course.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findFirst({
      where: { id}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { 
      published,
        title,
        description, price, pricingType, 
      introVideoUrl, externalLink, attachmentsToDelete 
    } = req.body;

    let thumbnailUrl = course.thumbnailUrl;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      const file = req.files.thumbnail[0];
      const base64 = file.buffer.toString('base64');
      thumbnailUrl = `data:${file.mimetype};base64,${base64}`;
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(published !== undefined && { published: String(published) === 'true' }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price && { price: Number(price) }),
        ...(pricingType && { pricingType }),
        ...(introVideoUrl !== undefined && { introVideoUrl }),
        ...(externalLink !== undefined && { externalLink }),
        thumbnailUrl
      }
    });

    if (attachmentsToDelete) {
      const idsToDelete = Array.isArray(attachmentsToDelete) ? attachmentsToDelete : [attachmentsToDelete];
      await prisma.courseAttachment.deleteMany({
        where: {
          id: { in: idsToDelete },
          courseId: id
        }
      });
    }

    if (req.files && req.files.attachments && req.files.attachments.length > 0) {
      const attachmentRecords = req.files.attachments.map(file => ({
        courseId: id,
        fileName: file.originalname,
        fileUrl: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        fileSize: file.size
      }));

      await prisma.courseAttachment.createMany({
        data: attachmentRecords
      });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: { id}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { courseId, title, position } = req.body;
    
    // verify teacher owns the course
    const course = await prisma.course.findFirst({
      where: { id: courseId}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized to modify this course' });
    }

    const newModule = await prisma.module.create({
      data: {
        courseId,
        title,
        position
      }
    });

    res.status(201).json(newModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { moduleId, title, position, videoUrl } = req.body;
    
    // Check if module exists and belongs to teacher's course
    const mod = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true }
    });

    if (!mod || mod.course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // extract vimeoId from URL for backward compatibility
    let vimeoId = null;
    if (videoUrl) {
      const match = videoUrl.match(/vimeo\.com\/(\d+)/);
      if (match) {
        vimeoId = match[1];
      }
    }

    const newLesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        position,
        vimeoId: vimeoId || videoUrl // fallback to raw string if it's not a standard vimeo URL
      }
    });

    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: mod.courseId, status: 'ACTIVE' },
        select: { studentId: true },
      });
      const studentIds = enrollments.map((e) => e.studentId);
      if (studentIds.length > 0) {
        await notifyNewLesson({
          studentIds,
          lessonTitle: title,
          courseTitle: mod.course.title,
          courseId: mod.courseId,
        });
      }
    } catch (notifyErr) {
      console.error('Notification error on new lesson:', notifyErr);
    }

    res.status(201).json(newLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    // We ideally should check authorization (does teacher own module's course), 
    // but assuming simple update for now.
    const updatedModule = await prisma.module.update({
      where: { id },
      data: { title }
    });

    res.status(200).json(updatedModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.module.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { title }
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lesson.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};

exports.reorderModules = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { updates } = req.body;

    const course = await prisma.course.findFirst({
      where: { id}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    for (let update of updates) {
      await prisma.module.update({
        where: { id: update.id },
        data: { position: update.position }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder modules' });
  }
};

exports.reorderLessons = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { updates } = req.body;

    const course = await prisma.course.findFirst({
      where: { id}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    for (let update of updates) {
      await prisma.lesson.update({
        where: { id: update.id },
        data: { position: update.position }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
};

exports.moveLesson = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { lessonId, moduleId, position } = req.body;

    const course = await prisma.course.findFirst({
      where: { id}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { moduleId, position }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to move lesson' });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const { 
      courseId, moduleId, lessonId, title, passingScore, position, questions,
      hasCertificate, certificateCondition, certificateConditionValue 
    } = req.body;

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: { id: courseId}
    });

    if (!course) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        moduleId: moduleId || null,
        lessonId: lessonId || null,
        title,
        passingScore,
        position,
        hasCertificate: Boolean(hasCertificate),
        certificateCondition: certificateCondition || null,
        certificateConditionValue: certificateConditionValue ? parseFloat(certificateConditionValue) : null,
        questions: {
          create: Array.isArray(questions) ? questions.map((q, i) => ({
            questionText: q.text || '',
            questionType: q.type || 'multiple_choice',
            imageUrl: q.imageUrl || null,
            position: i,
            options: {
              create: Array.isArray(q.options) ? q.options.map((o, j) => ({
                optionText: o.text || '',
                imageUrl: o.imageUrl || null,
                isCorrect: Boolean(o.correct),
                position: j
              })) : []
            }
          })) : []
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    res.status(201).json({ quizId: quiz.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create quiz', details: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const dataToUpdate = {};
    
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.description !== undefined) dataToUpdate.description = body.description || null;
    if (body.instructions !== undefined) dataToUpdate.instructions = body.instructions || null;
    if (body.passingScore !== undefined) dataToUpdate.passingScore = parseInt(body.passingScore) || 60;
    if (body.durationMinutes !== undefined) dataToUpdate.durationMinutes = body.durationMinutes ? parseInt(body.durationMinutes) : null;
    if (body.maxAttempts !== undefined) dataToUpdate.maxAttempts = parseInt(body.maxAttempts) || 1;
    if (body.shuffleQuestions !== undefined) dataToUpdate.shuffleQuestions = Boolean(body.shuffleQuestions);
    if (body.shuffleAnswers !== undefined) dataToUpdate.shuffleAnswers = Boolean(body.shuffleAnswers);
    if (body.showResultsImmediately !== undefined) dataToUpdate.showResultsImmediately = Boolean(body.showResultsImmediately);
    if (body.showCorrectAnswers !== undefined) dataToUpdate.showCorrectAnswers = Boolean(body.showCorrectAnswers);
    if (body.status !== undefined) dataToUpdate.status = typeof body.status === 'string' ? body.status.toUpperCase() : body.status;
    
    // Certs
    if (body.hasCertificate !== undefined) dataToUpdate.hasCertificate = Boolean(body.hasCertificate);
    if (body.certificateCondition !== undefined) dataToUpdate.certificateCondition = body.certificateCondition || null;
    if (body.certificateConditionValue !== undefined) {
      dataToUpdate.certificateConditionValue = body.certificateConditionValue ? parseFloat(body.certificateConditionValue) : null;
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: dataToUpdate
    });

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quiz.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const quizzes = await prisma.quiz.findMany({
      where: {
        course: {
          teacherId
        },
        deletedAt: null
      },
      include: {
        course: { select: { id: true, title: true, teacherId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
};

exports.getQuizDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        course: { teacherId },
        deletedAt: null
      },
      include: {
        questions: {
          orderBy: { position: 'asc' },
          include: {
            options: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quiz detail' });
  }
};

exports.getCoursesWithModules = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await prisma.course.findMany({
      where: { teacherId, deletedAt: null },
      include: {
        modules: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
          select: { 
            id: true, 
            title: true, 
            position: true,
            lessons: {
              where: { deletedAt: null },
              orderBy: { position: 'asc' },
              select: { id: true, title: true, position: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch courses with modules' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { q, courseId, enrollmentStatus, accountStatus } = req.query;

    const teacherCourses = await prisma.course.findMany({
      where: { teacherId },
      select: { id: true }
    });

    const teacherCourseIds = teacherCourses.map(c => c.id);

    if (teacherCourseIds.length === 0) {
      return res.status(200).json({ students: [] });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: { in: teacherCourseIds },
        ...(courseId && { courseId }),
        ...(enrollmentStatus && { status: enrollmentStatus.toUpperCase() }) // Assumes enum mapping if needed, or string matching
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            accountStatus: true,
            currentGrade: { select: { name: true } }
          }
        },
        course: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const byStudent = new Map();

    for (const enrollment of enrollments) {
      const { student } = enrollment;

      if (accountStatus && student.accountStatus !== accountStatus.toUpperCase()) continue;

      if (q) {
        const needle = q.toLowerCase();
        const hay = `${student.fullName || ''} ${student.phone || ''}`.toLowerCase();
        if (!hay.includes(needle)) continue;
      }

      const formattedEnrollment = {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseTitle: enrollment.course.title,
        status: enrollment.status.toLowerCase(),
        progressPercentage: enrollment.progressPercentage,
        expiresAt: enrollment.expiresAt,
        createdAt: enrollment.createdAt,
        lastViewedAt: enrollment.lastViewedAt
      };

      const existing = byStudent.get(student.id);
      if (!existing) {
        byStudent.set(student.id, {
          studentId: student.id,
          fullName: student.fullName || 'طالب',
          phone: student.phone,
          accountStatus: student.accountStatus ? student.accountStatus.toLowerCase() : 'active',
          gradeName: student.currentGrade?.name,
          enrolledCourses: 1,
          avgProgress: enrollment.progressPercentage,
          lastActivityAt: enrollment.lastViewedAt || enrollment.createdAt,
          enrollments: [formattedEnrollment]
        });
      } else {
        existing.enrollments.push(formattedEnrollment);
        existing.enrolledCourses = existing.enrollments.length;
        existing.avgProgress = Math.round(
          existing.enrollments.reduce((s, e) => s + e.progressPercentage, 0) / existing.enrollments.length
        );
        const activity = enrollment.lastViewedAt || enrollment.createdAt;
        if (!existing.lastActivityAt || new Date(activity) > new Date(existing.lastActivityAt)) {
          existing.lastActivityAt = activity;
        }
      }
    }

    const studentsList = Array.from(byStudent.values()).sort((a, b) => {
      const aTime = a.lastActivityAt ? new Date(a.lastActivityAt).getTime() : 0;
      const bTime = b.lastActivityAt ? new Date(b.lastActivityAt).getTime() : 0;
      return bTime - aTime;
    });

    res.status(200).json({ students: studentsList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.getStudentDetail = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: studentId } = req.params;

    const teacherCourses = await prisma.course.findMany({
      where: { teacherId },
      select: { id: true }
    });

    const courseIds = teacherCourses.map(c => c.id);

    if (courseIds.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    const profile = await prisma.user.findFirst({
      where: { id: studentId, role: 'STUDENT' },
      include: { currentGrade: { select: { name: true } } }
    });

    if (!profile) return res.status(404).json({ error: 'Student not found' });

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
        courseId: { in: courseIds }
      },
      include: {
        course: { select: { title: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (enrollments.length === 0) {
      return res.status(404).json({ error: 'Student not enrolled in any of your courses' });
    }

    const payments = await prisma.payment.findMany({
      where: {
        studentId,
        courseId: { in: courseIds }
      },
      include: {
        course: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        studentId,
        quiz: {
          courseId: { in: courseIds }
        }
      },
      include: {
        quiz: { select: { title: true, courseId: true } }
      },
      orderBy: { submittedAt: 'desc' },
      take: 20
    });

    res.status(200).json({
      profile: {
        id: profile.id,
        fullName: profile.fullName || 'طالب',
        phone: profile.phone,
        accountStatus: profile.accountStatus ? profile.accountStatus.toLowerCase() : 'active',
        lastLoginAt: null, // Depending on if tracking last login
        averageScore: 0,
        totalStudyTimeSeconds: 0,
        createdAt: profile.createdAt,
        gradeName: profile.currentGrade?.name
      },
      enrollments: enrollments.map(e => ({
        id: e.id,
        courseId: e.courseId,
        courseTitle: e.course.title,
        price: e.course.price,
        status: e.status.toLowerCase(),
        progressPercentage: e.progressPercentage,
        expiresAt: e.expiresAt,
        createdAt: e.createdAt,
        lastViewedAt: e.lastViewedAt
      })),
      payments: payments.map(p => ({
        id: p.id,
        courseId: p.courseId,
        courseTitle: p.course.title,
        amount: p.amount,
        status: p.status.toLowerCase(),
        createdAt: p.createdAt
      })),
      quizAttempts: quizAttempts.map(a => ({
        id: a.id,
        score: a.score,
        passed: a.passed,
        submittedAt: a.submittedAt,
        quizTitle: a.quiz.title,
        courseId: a.quiz.courseId
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

exports.updateStudentAccountStatus = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: studentId } = req.params;
    const { accountStatus } = req.body;

    // Verify teacher has this student
    const teacherCourses = await prisma.course.findMany({
      where: { teacherId },
      select: { id: true }
    });
    const courseIds = teacherCourses.map(c => c.id);

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId: { in: courseIds }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: studentId },
      data: { accountStatus: accountStatus.toUpperCase() }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update student status' });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id: studentId, enrollmentId } = req.params;
    const { status } = req.body;

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, studentId },
      include: { course: { select: { teacherId: true } } }
    });

    if (!enrollment || enrollment.course.teacherId !== teacherId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: status.toUpperCase() }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update enrollment status' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!settings) {
      return res.status(200).json({ settings: null });
    }

    // Convert keys to match expected frontend structure
    const formattedSettings = {
      id: settings.id,
      teacher_name: settings.teacherName,
      teacher_image: settings.teacherImage,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      contact_phone: settings.contactPhone,
      facebook: settings.facebook,
      whatsapp: settings.whatsapp
    };

    res.status(200).json({ settings: formattedSettings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.createSettings = async (req, res) => {
  try {
    const { teacher_name, hero_title, hero_subtitle, contact_phone, facebook, whatsapp } = req.body;

    let teacherImageUrl = null;
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      teacherImageUrl = `data:${req.file.mimetype};base64,${base64}`;
    }

    const settings = await prisma.settings.create({
      data: {
        teacherName: teacher_name,
        teacherImage: teacherImageUrl,
        heroTitle: hero_title,
        heroSubtitle: hero_subtitle,
        contactPhone: contact_phone,
        facebook,
        whatsapp
      }
    });

    res.status(201).json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_name, hero_title, hero_subtitle, contact_phone, facebook, whatsapp } = req.body;

    const updateData = {
      teacherName: teacher_name,
      heroTitle: hero_title,
      heroSubtitle: hero_subtitle,
      contactPhone: contact_phone,
      facebook,
      whatsapp
    };

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      updateData.teacherImage = `data:${req.file.mimetype};base64,${base64}`;
    }

    const settings = await prisma.settings.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// ==========================================
// GRADES MANAGEMENT
// ==========================================

exports.getGrades = async (req, res) => {
  try {
    if (!hasPermission(req.user, 'GRADE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const grades = await prisma.grade.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { courses: true, users: true }
        }
      }
    });

    const formattedGrades = grades.map(g => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
      description: g.description,
      icon: g.icon,
      colorTheme: g.colorTheme,
      order: g.order,
      isActive: g.isActive,
      courseCount: g._count.courses,
      studentCount: g._count.users,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt
    }));

    res.status(200).json({ grades: formattedGrades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

exports.createGrade = async (req, res) => {
  try {
    if (!hasPermission(req.user, 'GRADE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Grade name is required' });
    }

    // Auto-generate slug from name
    const baseSlug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u0621-\u064Aa-z0-9-]/g, '')
      || `grade-${Date.now()}`;

    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.grade.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get the next order value
    const maxOrderGrade = await prisma.grade.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    const nextOrder = (maxOrderGrade?.order ?? -1) + 1;

    const grade = await prisma.grade.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        icon: icon?.trim() || '📚',
        order: nextOrder,
        isActive: true
      }
    });

    res.status(201).json({ grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create grade' });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    if (!hasPermission(req.user, 'GRADE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    const existing = await prisma.grade.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    const data = {};
    if (name !== undefined && name.trim()) {
      data.name = name.trim();
    }
    if (description !== undefined) {
      data.description = description?.trim() || null;
    }
    if (icon !== undefined) {
      data.icon = icon?.trim() || '📚';
    }
    if (isActive !== undefined) {
      data.isActive = Boolean(isActive);
    }

    const grade = await prisma.grade.update({
      where: { id },
      data
    });

    res.status(200).json({ grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update grade' });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    if (!hasPermission(req.user, 'GRADE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { id },
      include: {
        _count: { select: { courses: true } }
      }
    });

    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    // Unlink courses from this grade before deleting
    if (grade._count.courses > 0) {
      await prisma.course.updateMany({
        where: { gradeId: id },
        data: { gradeId: null }
      });
    }

    // Unlink students from this grade
    await prisma.user.updateMany({
      where: { currentGradeId: id },
      data: { currentGradeId: null }
    });

    await prisma.grade.delete({ where: { id } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete grade' });
  }
};

exports.reorderGrades = async (req, res) => {
  try {
    if (!hasPermission(req.user, 'GRADE')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    for (const update of updates) {
      await prisma.grade.update({
        where: { id: update.id },
        data: { order: update.order }
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder grades' });
  }
};



exports.createQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, questionType, difficulty, marks, explanation, options } = req.body;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Get highest position
    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: { quizId: id },
      orderBy: { position: 'desc' }
    });
    const position = lastQuestion ? lastQuestion.position + 1 : 0;

    const parsedType = (typeof questionType === 'string' && questionType.toUpperCase() === 'TRUE_FALSE') ? 'TRUE_FALSE' : 'MULTIPLE_CHOICE';
    const parsedDiff = (typeof difficulty === 'string' && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())) ? difficulty.toUpperCase() : 'MEDIUM';

    const question = await prisma.quizQuestion.create({
      data: {
        quizId: id,
        questionText,
        questionType: parsedType,
        difficulty: parsedDiff,
        marks: parseFloat(marks) || 1,
        explanation: explanation || null,
        position,
        options: {
          create: (options || []).map((o, i) => ({
            optionText: o.optionText,
            isCorrect: Boolean(o.isCorrect),
            position: i
          }))
        }
      },
      include: { options: true }
    });

    res.status(201).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { questionText, questionType, difficulty, marks, explanation, options } = req.body;

    // We must delete old options and recreate them to be safe, or update them.
    // Deleting and recreating is easier for multiple choice options.
    await prisma.quizOption.deleteMany({
      where: { questionId }
    });

    const parsedType = (typeof questionType === 'string' && questionType.toUpperCase() === 'TRUE_FALSE') ? 'TRUE_FALSE' : 'MULTIPLE_CHOICE';
    const parsedDiff = (typeof difficulty === 'string' && ['EASY', 'MEDIUM', 'HARD'].includes(difficulty.toUpperCase())) ? difficulty.toUpperCase() : 'MEDIUM';

    const question = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        questionText,
        questionType: parsedType,
        difficulty: parsedDiff,
        marks: parseFloat(marks) || 1,
        explanation: explanation || null,
        options: {
          create: (options || []).map((o, i) => ({
            optionText: o.optionText,
            isCorrect: Boolean(o.isCorrect),
            position: i
          }))
        }
      },
      include: { options: true }
    });

    res.json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    
    await prisma.quizQuestion.delete({
      where: { id: questionId }
    });

    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

// ==========================================
// ASSISTANT MANAGEMENT
// ==========================================

exports.getAssistants = async (req, res) => {
  try {
    const assistants = await prisma.user.findMany({
      where: { role: 'ASSISTANT' },
      select: {
        id: true,
        email: true,
        fullName: true,
        permissions: true,
        createdAt: true,
        lastLoginAt: true
      }
    });
    res.json(assistants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assistants' });
  }
};

exports.createAssistant = async (req, res) => {
  try {
    const { email, password, fullName, permissions } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const assistant = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'ASSISTANT',
        permissions: permissions || [],
        isVerified: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        permissions: true,
        createdAt: true
      }
    });

    res.status(201).json(assistant);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create assistant' });
  }
};

exports.updateAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, permissions } = req.body;
    
    const assistant = await prisma.user.update({
      where: { id },
      data: {
        ...(fullName && { fullName }),
        ...(permissions && { permissions })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        permissions: true
      }
    });

    res.json(assistant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update assistant' });
  }
};

exports.resetAssistantPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

exports.deleteAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id }
    });
    res.json({ message: 'Assistant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete assistant' });
  }
};

