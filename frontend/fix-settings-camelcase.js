const fs = require('fs');
const settingsPath = 'src/features/exams/components/ExamSettingsForm.tsx';
let settings = fs.readFileSync(settingsPath, 'utf8');

settings = settings.replace(/duration_minutes/g, 'durationMinutes');
settings = settings.replace(/passing_score/g, 'passingScore');
settings = settings.replace(/max_attempts/g, 'maxAttempts');
settings = settings.replace(/shuffle_questions/g, 'shuffleQuestions');
settings = settings.replace(/shuffle_answers/g, 'shuffleAnswers');
settings = settings.replace(/show_results_immediately/g, 'showResultsImmediately');
settings = settings.replace(/show_correct_answers/g, 'showCorrectAnswers');

fs.writeFileSync(settingsPath, settings);
console.log("Settings camelCase fix applied.");
