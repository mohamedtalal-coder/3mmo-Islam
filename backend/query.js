require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.quiz.findMany().then(quizzes => {
  console.log(JSON.stringify(quizzes, null, 2));
  process.exit(0);
});
