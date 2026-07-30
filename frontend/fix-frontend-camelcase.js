const fs = require('fs');
const path = require('path');

const qBankPath = 'src/features/exams/components/ExamQuestionBank.tsx';
let qBank = fs.readFileSync(qBankPath, 'utf8');

qBank = qBank.replace(/q\.question_text/g, 'q.questionText');
qBank = qBank.replace(/q\.question_type/g, 'q.questionType');
qBank = qBank.replace(/q\.quiz_options/g, 'q.options');
qBank = qBank.replace(/opt\.option_text/g, 'opt.optionText');
qBank = qBank.replace(/opt\.is_correct/g, 'opt.isCorrect');

fs.writeFileSync(qBankPath, qBank);

const qFormPath = 'src/features/exams/components/QuestionForm.tsx';
let qForm = fs.readFileSync(qFormPath, 'utf8');

qForm = qForm.replace(/question_text/g, 'questionText');
qForm = qForm.replace(/question_type/g, 'questionType');
qForm = qForm.replace(/quiz_options/g, 'options');
qForm = qForm.replace(/option_text/g, 'optionText');
qForm = qForm.replace(/is_correct/g, 'isCorrect');

fs.writeFileSync(qFormPath, qForm);
console.log("Frontend camelCase fix applied.");
