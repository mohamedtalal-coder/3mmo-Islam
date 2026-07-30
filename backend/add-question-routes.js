const fs = require('fs');
const controllersPath = 'src/features/teacher/controllers.js';
let controllersCode = fs.readFileSync(controllersPath, 'utf8');

const newControllers = `
exports.createQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, question_type, difficulty, marks, explanation, options } = req.body;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Get highest position
    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: { quizId: id },
      orderBy: { position: 'desc' }
    });
    const position = lastQuestion ? lastQuestion.position + 1 : 0;

    const question = await prisma.quizQuestion.create({
      data: {
        quizId: id,
        questionText: question_text,
        questionType: question_type,
        difficulty: difficulty || 'medium',
        marks: parseFloat(marks) || 1,
        explanation: explanation || null,
        position,
        options: {
          create: (options || []).map((o, i) => ({
            optionText: o.option_text,
            isCorrect: Boolean(o.is_correct),
            position: i
          }))
        }
      },
      include: { options: true }
    });

    res.status(201).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { question_text, question_type, difficulty, marks, explanation, options } = req.body;

    // We must delete old options and recreate them to be safe, or update them.
    // Deleting and recreating is easier for multiple choice options.
    await prisma.quizOption.deleteMany({
      where: { questionId }
    });

    const question = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        questionText: question_text,
        questionType: question_type,
        difficulty: difficulty || 'medium',
        marks: parseFloat(marks) || 1,
        explanation: explanation || null,
        options: {
          create: (options || []).map((o, i) => ({
            optionText: o.option_text,
            isCorrect: Boolean(o.is_correct),
            position: i
          }))
        }
      },
      include: { options: true }
    });

    res.json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    
    await prisma.quizQuestion.delete({
      where: { id: questionId }
    });

    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};
`;

fs.writeFileSync(controllersPath, controllersCode + "\n" + newControllers);
console.log('Controllers added.');

const routesPath = 'src/features/teacher/routes.js';
let routesCode = fs.readFileSync(routesPath, 'utf8');

const newRoutes = `
router.post('/quizzes/:id/questions', verifyToken, teacherController.createQuestion);
router.put('/quizzes/:id/questions/:questionId', verifyToken, teacherController.updateQuestion);
router.delete('/quizzes/:id/questions/:questionId', verifyToken, teacherController.deleteQuestion);
`;

routesCode = routesCode.replace('module.exports = router;', newRoutes + '\nmodule.exports = router;');
fs.writeFileSync(routesPath, routesCode);
console.log('Routes added.');
