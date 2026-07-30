const prisma = require('./src/db');
const bcrypt = require('bcryptjs');

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Create Course Admin
  const courseAdmin = await prisma.user.upsert({
    where: { email: 'course@admin.com' },
    update: {},
    create: {
      fullName: 'Course Admin',
      email: 'course@admin.com',
      passwordHash: hashedPassword,
      phone: '01000000001',
      role: 'COURSE_ADMIN',
    },
  });
  console.log('Created Course Admin:', courseAdmin.email, 'Password: admin123');

  // 2. Create Exam Admin
  const examAdmin = await prisma.user.upsert({
    where: { email: 'exam@admin.com' },
    update: {},
    create: {
      fullName: 'Exam Admin',
      email: 'exam@admin.com',
      passwordHash: hashedPassword,
      phone: '01000000002',
      role: 'EXAM_ADMIN',
    },
  });
  console.log('Created Exam Admin:', examAdmin.email, 'Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
