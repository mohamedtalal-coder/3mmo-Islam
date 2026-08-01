const prisma = require('../src/db');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Start seeding...');

  // 0. Clean up existing data to ensure a fresh demo state
  console.log('Cleaning up old data...');
  await prisma.review.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.user.deleteMany({
    where: { role: 'STUDENT' }
  });

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

  // 3. Create or Update Teacher
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

  // 4. Create Grades and Subjects
  console.log('Creating Grades & Subjects...');
  const gradesData = [
    { name: 'الصف الأول الثانوي', slug: 'sec-1', icon: '📖' },
    { name: 'الصف الثاني الثانوي', slug: 'sec-2', icon: '📝' },
    { name: 'الصف الثالث الثانوي', slug: 'sec-3', icon: '🎓' }
  ];

  const grades = [];
  for (const g of gradesData) {
    const grade = await prisma.grade.create({
      data: {
        name: g.name,
        slug: g.slug,
        description: `مناهج ${g.name}`,
        icon: g.icon,
        subjects: {
          create: [
            { name: 'اللغة العربية', slug: `arabic-${g.slug}` }
          ]
        }
      },
      include: { subjects: true }
    });
    grades.push(grade);
  }

  // 5. Create Students
  console.log('Creating Students...');
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.create({
      data: {
        email: `student${i}@example.com`,
        passwordHash: hashedPassword,
        fullName: `طالب تجريبي ${i}`,
        role: 'STUDENT',
        phone: `0101111111${i}`,
        walletBalance: i === 1 ? 500 : 0, // Give first student some balance
        currentGradeId: grades[0].id
      }
    });
    students.push(student);
  }
  console.log(`Created 5 students (e.g. student1@example.com / password123)`);

  // 6. Create Paid Course
  console.log('Creating Paid Course...');
  const paidCourse = await prisma.course.create({
    data: {
      title: 'كورس النحو الشامل للمرحلة الثانوية',
      description: 'كورس متكامل لشرح قواعد النحو بطريقة مبسطة وتفاعلية.',
      price: 150,
      pricingType: 'ONE_TIME',
      published: true,
      teacherId: teacher.id,
      gradeId: grades[0].id,
      subjectId: grades[0].subjects[0].id,
      modules: {
        create: [
          {
            title: 'الوحدة الأولى: أساسيات النحو',
            position: 1,
            lessons: {
              create: [
                { title: 'الدرس الأول: المبتدأ والخبر', position: 1, vimeoId: 'https://www.youtube.com/embed/P6s-b5m4p6E' },
                { title: 'الدرس الثاني: الأفعال الناقصة', position: 2, vimeoId: 'https://www.youtube.com/embed/5U9N5Jg92eE' }
              ]
            }
          }
        ]
      }
    }
  });

  // Enroll some students in the paid course
  await prisma.enrollment.createMany({
    data: [
      { studentId: students[0].id, courseId: paidCourse.id },
      { studentId: students[1].id, courseId: paidCourse.id }
    ]
  });

  // 7. Create Free Course (Shown on Landing Page)
  console.log('Creating Free Course...');
  const freeCourse = await prisma.course.create({
    data: {
      title: 'مراجعة مجانية: البلاغة',
      description: 'كورس مجاني لمراجعة أهم قواعد البلاغة قبل الامتحانات.',
      price: 0,
      pricingType: 'ONE_TIME',
      published: true,
      showOnLandingPage: true,
      teacherId: teacher.id,
      gradeId: grades[2].id, // 3rd sec
      subjectId: grades[2].subjects[0].id,
      modules: {
        create: [
          {
            title: 'البلاغة',
            position: 1,
            lessons: {
              create: [
                { title: 'مقدمة في علم البيان', position: 1 }
              ]
            }
          }
        ]
      }
    }
  });

  // 8. Create Free Standalone Exam (Shown on Landing Page)
  console.log('Creating Free Standalone Exam...');
  const freeExam = await prisma.quiz.create({
    data: {
      title: 'اختبار تحديد مستوى (مجاني)',
      description: 'اختبار سريع لتحديد مستواك في اللغة العربية.',
      isStandalone: true,
      status: 'PUBLISHED',
      passingScore: 50,
      totalMarks: 20,
      questions: {
        create: [
          {
            questionText: 'أين الفاعل في جملة "أكل الولد التفاحة"؟',
            marks: 10,
            questionType: 'MULTIPLE_CHOICE',
            options: {
              create: [
                { optionText: 'أكل', isCorrect: false },
                { optionText: 'الولد', isCorrect: true },
                { optionText: 'التفاحة', isCorrect: false }
              ]
            }
          },
          {
            questionText: 'كلمة "مدرسة" تعتبر:',
            marks: 10,
            questionType: 'MULTIPLE_CHOICE',
            options: {
              create: [
                { optionText: 'اسم', isCorrect: true },
                { optionText: 'فعل', isCorrect: false },
                { optionText: 'حرف', isCorrect: false }
              ]
            }
          }
        ]
      }
    },
    include: { questions: { include: { options: true } } }
  });

  // 9. Add Exam Attempts to Free Exam
  console.log('Adding Exam Attempts...');
  await prisma.quizAttempt.create({
    data: {
      quizId: freeExam.id,
      studentId: students[0].id,
      score: 100,
      passed: true,
      status: 'GRADED',
      answers: JSON.parse(`{"${freeExam.questions[0].id}": "${freeExam.questions[0].options.find(o=>o.isCorrect).id}", "${freeExam.questions[1].id}": "${freeExam.questions[1].options.find(o=>o.isCorrect).id}"}`),
      submittedAt: new Date()
    }
  });

  await prisma.quizAttempt.create({
    data: {
      quizId: freeExam.id,
      studentId: students[1].id,
      score: 50,
      passed: true,
      status: 'GRADED',
      answers: JSON.parse(`{"${freeExam.questions[0].id}": "${freeExam.questions[0].options.find(o=>o.isCorrect).id}", "${freeExam.questions[1].id}": "${freeExam.questions[1].options.find(o=>!o.isCorrect).id}"}`),
      submittedAt: new Date()
    }
  });

  await prisma.quizAttempt.create({
    data: {
      quizId: freeExam.id,
      studentId: students[2].id,
      score: 0,
      passed: false,
      status: 'GRADED',
      answers: JSON.parse(`{"${freeExam.questions[0].id}": "${freeExam.questions[0].options.find(o=>!o.isCorrect).id}", "${freeExam.questions[1].id}": "${freeExam.questions[1].options.find(o=>!o.isCorrect).id}"}`),
      submittedAt: new Date()
    }
  });

  // 10. Create Reviews for Courses
  console.log('Adding Reviews...');
  await prisma.review.createMany({
    data: [
      {
        courseId: paidCourse.id,
        studentId: students[0].id,
        rating: 5,
        comment: 'شرح ممتاز جداً ومبسط، شكراً عمو إسلام!'
      },
      {
        courseId: paidCourse.id,
        studentId: students[1].id,
        rating: 4,
        comment: 'كورس جيد واستفدت منه كثيراً.'
      },
      {
        courseId: freeCourse.id,
        studentId: students[3].id,
        rating: 5,
        comment: 'مراجعة رائعة ومجانية، بارك الله فيك.'
      }
    ]
  });

  console.log('Seeding finished successfully! You are ready for your discussion.');
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
