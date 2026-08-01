const prisma = require('../../db');

exports.getPublicCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
        published: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        pricingType: true,
        subscriptionPeriodDays: true,
        published: true,
        teacher: {
          select: {
            id: true,
            fullName: true
          }
        },
        grade: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.getHomeData = async (req, res) => {
  try {
    let [courses, grades, settings, courseCount, studentCount, faqs, freeCourses, freeExams] = await Promise.all([
      prisma.course.findMany({
        where: { deletedAt: null, published: true, showOnLandingPage: false },
        include: {
          teacher: { select: { fullName: true } },
          grade: { select: { name: true, slug: true } },
          subject: { select: { name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 6
      }),
      prisma.grade.findMany({
        orderBy: { order: 'asc' },
        include: {
          subjects: true
        }
      }),
      prisma.settings.findFirst({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where: { deletedAt: null, published: true } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      }),
      prisma.course.findMany({
        where: { deletedAt: null, published: true, showOnLandingPage: true },
        include: {
          teacher: { select: { fullName: true } },
          grade: { select: { name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quiz.findMany({
        where: { deletedAt: null, status: 'PUBLISHED', isStandalone: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Seed FAQs if none exist
    if (faqs.length === 0) {
      await prisma.faq.createMany({
        data: [
          { question: "كيف يمكنني الاشتراك في الكورسات؟", answer: "يمكنك الاشتراك من خلال إنشاء حساب كطالب، ثم تصفح الكورسات المتاحة واختيار الكورس المناسب لك والنقر على زر 'اشترك الآن'.", position: 1 },
          { question: "هل يمكنني مشاهدة الدروس في أي وقت؟", answer: "نعم، جميع الدروس مسجلة ومتاحة لك لمشاهدتها في أي وقت يناسبك بمجرد اشتراكك في الكورس.", position: 2 },
          { question: "هل يوجد شهادة بعد إتمام الكورس؟", answer: "نعم، بمجرد اجتيازك للاختبار النهائي لكل كورس، ستحصل على شهادة إتمام معتمدة من المنصة.", position: 3 },
          { question: "كيف يمكنني التواصل مع المعلم؟", answer: "يمكنك طرح أسئلتك في قسم التعليقات أسفل كل درس، وسيقوم المعلم بالإجابة عليها في أقرب وقت.", position: 4 }
        ]
      });
      faqs = await prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' }
      });
    }

    // Format settings to match frontend expectations
    const formattedSettings = settings ? {
      teacher_name: settings.teacherName,
      teacher_image: settings.teacherImage,
      hero_title: settings.heroTitle,
      hero_subtitle: settings.heroSubtitle,
      contact_phone: settings.contactPhone,
      facebook: settings.facebook,
      whatsapp: settings.whatsapp
    } : null;

    res.status(200).json({
      courses,
      grades,
      settings: formattedSettings,
      stats: {
        courseCount,
        studentCount
      },
      faqs,
      freeCourses,
      freeExams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch home data' });
  }
};

exports.getGradeDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    const grade = await prisma.grade.findUnique({
      where: { slug },
      include: {
        subjects: true
      }
    });

    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    const courses = await prisma.course.findMany({
      where: {
        gradeId: grade.id,
        deletedAt: null,
        published: true
      },
      include: {
        teacher: { select: { fullName: true } },
        subject: { select: { name: true, slug: true } }
      }
    });

    res.status(200).json({ grade, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grade details' });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { number } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: number },
      include: {
        student: { select: { fullName: true } },
        course: { select: { title: true } }
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({ certificate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
};

exports.getAllGrades = async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    res.status(200).json({ grades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};
