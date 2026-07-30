const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
prisma.quiz.findMany().then(quizzes => {
  console.log(quizzes);
  process.exit(0);
}).catch(console.error);
