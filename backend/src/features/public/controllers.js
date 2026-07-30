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
    const [courses, grades, settings, courseCount, studentCount] = await Promise.all([
      prisma.course.findMany({
        where: { deletedAt: null, published: true },
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
      prisma.user.count({ where: { role: 'STUDENT' } })
    ]);

    // Format settings to match frontend expectations
    const formattedSettings = settings ? {
      teacher_name: settings.teacherName,
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
      }
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
