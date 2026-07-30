const prisma = require('../../db');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'STUDENT') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // 1. Get enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            description: true,
            price: true,
            pricingType: true,
            deletedAt: true,
            teacher: {
              select: { fullName: true }
            }
          }
        }
      }
    });

    // Filter out deleted courses
    const activeEnrollments = enrollments.filter(e => e.course && !e.course.deletedAt);

    // 2. Get certificates
    const certificates = await prisma.certificate.findMany({
      where: { studentId: userId },
      select: { courseId: true }
    });
    const certifiedCourseIds = certificates.map(c => c.courseId);

    // 3. Get lesson progress
    const progressData = await prisma.lessonProgress.findMany({
      where: { studentId: userId },
      select: { lessonId: true }
    });
    const completedLessonIds = progressData.map(p => p.lessonId);

    // 4. Get recommended courses (published, not deleted, not enrolled, matching grade)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentGradeId: true }
    });

    const enrolledCourseIds = activeEnrollments.map(e => e.courseId);
    
    const recommendedCoursesQuery = {
      where: {
        published: true,
        deletedAt: null,
        id: { notIn: enrolledCourseIds }
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        price: true,
      },
      take: 3
    };

    if (user.currentGradeId) {
      recommendedCoursesQuery.where.gradeId = user.currentGradeId;
    }

    const recommendedCourses = await prisma.course.findMany(recommendedCoursesQuery);

    res.status(200).json({
      enrollments: activeEnrollments,
      certificates: certifiedCourseIds,
      completedLessonIds,
      recommendedCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'STUDENT') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            price: true,
            deletedAt: true
          }
        }
      }
    });

    const certificates = await prisma.certificate.findMany({
      where: { studentId: userId },
      select: { courseId: true }
    });
    const certifiedCourseIds = certificates.map(c => c.courseId);

    res.status(200).json({ enrollments, certifiedCourseIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
};

exports.getStudentCourseDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        courseId: courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    if (enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'Enrollment expired' });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        published: true,
        deletedAt: null
      },
      select: { id: true, title: true }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const modules = await prisma.module.findMany({
      where: {
        courseId: courseId,
        deletedAt: null
      },
      orderBy: { position: 'asc' },
      include: {
        lessons: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
          select: { id: true, title: true, position: true }
        }
      }
    });

    const progressData = await prisma.lessonProgress.findMany({
      where: { studentId: userId },
      select: { lessonId: true }
    });
    const completedLessonIds = progressData.map(p => p.lessonId);

    // Fetch published quizzes for this course
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId: courseId,
        status: 'PUBLISHED',
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        moduleId: true,
        lessonId: true
      }
    });

    const certificate = await prisma.certificate.findFirst({
      where: {
        courseId: courseId,
        studentId: userId
      }
    });

    // Update last_viewed_at
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { lastViewedAt: new Date() }
    });

    res.status(200).json({
      course,
      modules,
      quizzes,
      completedLessonIds,
      certificate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.getStudentQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        deletedAt: null
      },
      include: {
        questions: {
          orderBy: { position: 'asc' },
          include: {
            options: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                optionText: true
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
};

exports.submitStudentQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const quiz = await prisma.quiz.findFirst({
      where: { id, deletedAt: null },
      include: {
        questions: {
          include: {
            options: {
              where: { isCorrect: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach(q => {
      const studentAnswer = answers[q.id];
      if (!studentAnswer) return;

      const correctOption = q.options[0];
      if (correctOption && studentAnswer === correctOption.id) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    let certificate = null;

    if (passed && quiz.hasCertificate) {
      // Check if student already has a certificate for this course
      const existingCert = await prisma.certificate.findFirst({
        where: {
          studentId: userId,
          courseId: quiz.courseId
        }
      });

      if (existingCert) {
        certificate = existingCert;
      } else {
        const certificateNumber = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        certificate = await prisma.certificate.create({
          data: {
            studentId: userId,
            courseId: quiz.courseId,
            quizId: quiz.id,
            certificateNumber
          }
        });
      }
    }

    // Save QuizAttempt
    await prisma.quizAttempt.create({
      data: {
        studentId: userId,
        quizId: quiz.id,
        score,
        passed,
      }
    });

    // Recalculate average score
    const attempts = await prisma.quizAttempt.findMany({
      where: { studentId: userId }
    });
    if (attempts.length > 0) {
      const sum = attempts.reduce((acc, curr) => acc + curr.score, 0);
      const avg = sum / attempts.length;
      await prisma.user.update({
        where: { id: userId },
        data: { averageScore: avg }
      });
    }

    // Recalculate course progress
    await recalculateCourseProgress(userId, quiz.courseId);


    res.status(200).json({
      score,
      passed,
      correctCount,
      totalQuestions,
      passingScore: quiz.passingScore,
      certificate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

exports.getStudentCertificates = async (req, res) => {
  try {
    const studentId = req.user.id;

    const certificates = await prisma.certificate.findMany({
      where: { studentId },
      include: {
        course: {
          select: { id: true, title: true, thumbnailUrl: true }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });

    res.status(200).json({ certificates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_grade_id } = req.body;

    if (!current_grade_id) {
      return res.status(400).json({ error: 'current_grade_id is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentGradeId: current_grade_id }
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId }
      }
    });

    if (existing) {
      return res.status(200).json({ success: true, redirectUrl: `/courses/${courseId}` });
    }

    // Direct enrollment for now (mock payment)
    await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'ACTIVE'
      }
    });

    res.status(200).json({ success: true, redirectUrl: `/courses/${courseId}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

exports.getLessonVideo = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: { courseId: true }
        }
      }
    });

    if (!lesson || lesson.deletedAt) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        courseId: lesson.module.courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'Not enrolled in this course' });
    }

    // Usually vimeoId is something like a video ID or URL.
    // For now, if no vimeoId exists or it's too short to be a valid ID, return a dummy video for demo purposes.
    const url = (lesson.vimeoId && lesson.vimeoId.length > 5)
      ? (lesson.vimeoId.startsWith('http') ? lesson.vimeoId : `https://player.vimeo.com/video/${lesson.vimeoId}`)
      : "https://www.youtube.com/embed/dQw4w9WgXcQ"; // dummy

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch video url' });
  }
};

const recalculateCourseProgress = async (studentId, courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: true,
          quizzes: true
        }
      }
    }
  });
  if (!course) return;

  let totalItems = 0;
  const lessonIds = [];
  const quizIds = [];

  course.modules.forEach(m => {
    m.lessons.forEach(l => {
      totalItems++;
      lessonIds.push(l.id);
    });
    m.quizzes.forEach(q => {
      totalItems++;
      quizIds.push(q.id);
    });
  });

  if (totalItems === 0) return;

  const completedLessonsCount = await prisma.lessonProgress.count({
    where: {
      studentId,
      lessonId: { in: lessonIds }
    }
  });

  const passedQuizzesCount = await prisma.quizAttempt.count({
    where: {
      studentId,
      quizId: { in: quizIds },
      passed: true
    }
  });

  const progressPercentage = Math.round(((completedLessonsCount + passedQuizzesCount) / totalItems) * 100);

  await prisma.enrollment.updateMany({
    where: { studentId, courseId },
    data: { progressPercentage }
  });
};

exports.toggleLessonProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { lessonId, completed } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (completed) {
      const existing = await prisma.lessonProgress.findFirst({
        where: { studentId, lessonId }
      });
      if (!existing) {
        await prisma.lessonProgress.create({
          data: { studentId, lessonId }
        });
      }
    } else {
      await prisma.lessonProgress.deleteMany({
        where: { studentId, lessonId }
      });
    }

    await recalculateCourseProgress(studentId, lesson.module.courseId);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to toggle progress' });
  }
};
