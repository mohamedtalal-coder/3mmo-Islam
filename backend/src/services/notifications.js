const prisma = require('../db');

const NOTIFICATION_TYPES = {
  COURSE: 'course',
  QUIZ: 'quiz',
  CERTIFICATE: 'certificate',
  PAYMENT: 'payment',
  ENROLLMENT: 'enrollment',
};

async function createNotification({ userId, type, title, body, link }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notifyCourseUpdates: true, notifyQuizReminders: true, notifyCertificates: true, notifyPayments: true }
  });
  
  if (user) {
    if (type === NOTIFICATION_TYPES.COURSE && !user.notifyCourseUpdates) return;
    if (type === NOTIFICATION_TYPES.QUIZ && !user.notifyQuizReminders) return;
    if (type === NOTIFICATION_TYPES.CERTIFICATE && !user.notifyCertificates) return;
    if (type === NOTIFICATION_TYPES.PAYMENT && !user.notifyPayments) return;
  }

  return prisma.notification.create({
    data: { userId, type, title, body, link: link || null },
  });
}

async function notifyStudentEnrollment({ studentId, course }) {
  const isSubscription = course.pricingType === 'SUBSCRIPTION';
  await createNotification({
    userId: studentId,
    type: NOTIFICATION_TYPES.PAYMENT,
    title: isSubscription ? 'تم تفعيل الاشتراك' : 'تأكيد الدفع',
    body: isSubscription
      ? `تم تفعيل اشتراكك في دورة "${course.title}" بنجاح`
      : `تم استلام دفعتك بنجاح لدورة "${course.title}"`,
    link: `/dashboard/student/courses/${course.id}`,
  });

  await createNotification({
    userId: studentId,
    type: NOTIFICATION_TYPES.COURSE,
    title: 'مرحباً بك في الدورة!',
    body: `يمكنك الآن البدء في دراسة "${course.title}"`,
    link: `/dashboard/student/courses/${course.id}`,
  });
}

async function notifyTeacherNewEnrollment({ teacherId, studentName, courseTitle, studentId }) {
  await createNotification({
    userId: teacherId,
    type: NOTIFICATION_TYPES.ENROLLMENT,
    title: 'انضمام طالب جديد',
    body: `انضم ${studentName} إلى دورة "${courseTitle}"`,
    link: `/dashboard/teacher/students/${studentId}`,
  });
}

async function notifyCertificateEarned({ studentId, courseTitle, courseId }) {
  await createNotification({
    userId: studentId,
    type: NOTIFICATION_TYPES.CERTIFICATE,
    title: 'شهادة جاهزة!',
    body: `تهانينا! شهادة إتمام دورة "${courseTitle}" جاهزة للتحميل`,
    link: '/dashboard/student/certificates',
  });
}

async function notifyQuizResult({ studentId, quizTitle, score, passed, courseId }) {
  await createNotification({
    userId: studentId,
    type: NOTIFICATION_TYPES.QUIZ,
    title: passed ? 'نجحت في الاختبار!' : 'نتيجة الاختبار',
    body: passed
      ? `حصلت على ${score}% في "${quizTitle}" — أحسنت!`
      : `حصلت على ${score}% في "${quizTitle}". حاول مرة أخرى!`,
    link: `/dashboard/student/courses/${courseId}`,
  });
}

async function notifyNewLesson({ studentIds, lessonTitle, courseTitle, courseId }) {
  const users = await prisma.user.findMany({
    where: { id: { in: studentIds }, notifyCourseUpdates: true },
    select: { id: true }
  });
  const notifyIds = users.map(u => u.id);

  const notifications = notifyIds.map((userId) => ({
    userId,
    type: NOTIFICATION_TYPES.COURSE,
    title: 'درس جديد متاح',
    body: `تم إضافة "${lessonTitle}" في دورة "${courseTitle}"`,
    link: `/dashboard/student/courses/${courseId}`,
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }
}

async function syncSubscriptionExpiryWarnings(studentId) {
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const expiringEnrollments = await prisma.enrollment.findMany({
    where: {
      studentId,
      status: 'ACTIVE',
      expiresAt: { gte: now, lte: inSevenDays },
    },
    include: { course: { select: { id: true, title: true } } },
  });

  for (const enrollment of expiringEnrollments) {
    const daysLeft = Math.ceil(
      (new Date(enrollment.expiresAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );

    const recentWarning = await prisma.notification.findFirst({
      where: {
        userId: studentId,
        type: NOTIFICATION_TYPES.PAYMENT,
        body: { contains: enrollment.course.title },
        createdAt: { gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
      },
    });

    if (!recentWarning) {
      await createNotification({
        userId: studentId,
        type: NOTIFICATION_TYPES.PAYMENT,
        title: 'اشتراكك ينتهي قريباً',
        body: `ينتهي اشتراكك في "${enrollment.course.title}" خلال ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}. جدّد الآن للاستمرار`,
        link: `/checkout/${enrollment.course.id}`,
      });
    }
  }
}

module.exports = {
  NOTIFICATION_TYPES,
  createNotification,
  notifyStudentEnrollment,
  notifyTeacherNewEnrollment,
  notifyCertificateEarned,
  notifyQuizResult,
  notifyNewLesson,
  syncSubscriptionExpiryWarnings,
};
