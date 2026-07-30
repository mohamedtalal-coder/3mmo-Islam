const prisma = require('./src/db');
prisma.quiz.findMany().then(quizzes => {
  console.log(quizzes);
  process.exit(0);
}).catch(console.error);
