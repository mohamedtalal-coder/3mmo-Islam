const prisma = require('../src/db');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Start seeding...');

  // 1. Setup basic settings
  const settingsData = {
    teacherName: 'عمو إسلام',
    heroTitle: 'أهلاً بك في منصة عمو إسلام',
    heroSubtitle: 'تعلم اللغة العربية بذكاء وتفوق',
    contactPhone: '01000000000',
    facebook: 'https://facebook.com',
    whatsapp: '01000000000'
  };
  
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: settingsData,
    create: { id: 'default', ...settingsData }
  });

  // 2. Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 3. Create Teacher
  const teacherData = {
    passwordHash: hashedPassword,
    fullName: 'عمو إسلام',
    role: 'TEACHER',
    phone: '01000000000'
  };

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: teacherData,
    create: { email: 'teacher@example.com', ...teacherData },
  });
  console.log(`Created teacher: ${teacher.email} / password123`);

  // 4. Create Student
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      passwordHash: hashedPassword,
      fullName: 'طالب مجتهد',
      role: 'STUDENT',
      phone: '01011111111'
    },
  });
  console.log(`Created student: ${student.email} / password123`);

  // 5. Create Grade & Subject
  const grade = await prisma.grade.upsert({
    where: { slug: 'prep-1' },
    update: {},
    create: {
      name: 'الصف الأول الإعدادي',
      slug: 'prep-1',
      description: 'مناهج الصف الأول الإعدادي',
      icon: '📚'
    }
  });

  const subject = await prisma.subject.upsert({
    where: {
      gradeId_slug: { gradeId: grade.id, slug: 'arabic-prep-1' }
    },
    update: {},
    create: {
      name: 'اللغة العربية',
      slug: 'arabic-prep-1',
      gradeId: grade.id
    }
  });

  // 6. Create a Course
  const course = await prisma.course.create({
    data: {
      title: 'كورس اللغة العربية الشامل',
      description: 'كورس متكامل لشرح منهج اللغة العربية بطريقة مبسطة وتفاعلية.',
      price: 150,
      pricingType: 'ONE_TIME',
      published: true,
      teacherId: teacher.id,
      gradeId: grade.id,
      subjectId: subject.id,
      modules: {
        create: [
          {
            title: 'الوحدة الأولى: النحو',
            position: 1,
            lessons: {
              create: [
                {
                  title: 'الدرس الأول: المبتدأ والخبر',
                  position: 1,
                  vimeoId: 'https://www.youtube.com/embed/P6s-b5m4p6E' // Arabic Grammar video
                },
                {
                  title: 'الدرس الثاني: الفاعل والمفعول به',
                  position: 2,
                  vimeoId: 'https://www.youtube.com/embed/5U9N5Jg92eE' // Arabic Grammar video
                }
              ]
            }
          }
        ]
      }
    }
  });
  console.log(`Created course: ${course.title}`);

  // 7. Enroll Student in Course
  await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: course.id
    }
  });
  console.log(`Enrolled student in course`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
