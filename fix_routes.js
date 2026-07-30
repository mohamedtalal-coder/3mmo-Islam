const fs = require('fs');
let content = fs.readFileSync('backend/src/features/teacher/routes.js', 'utf8');

if (!content.includes('requirePermission')) {
  content = content.replace("const { verifyToken } = require('../../middleware/auth');", "const { verifyToken, requirePermission } = require('../../middleware/auth');");
}

// Add requirePermission('DASHBOARD') to /dashboard
content = content.replace("router.get('/dashboard', verifyToken, teacherController.getDashboardData);", "router.get('/dashboard', verifyToken, requirePermission('DASHBOARD'), teacherController.getDashboardData);");

// COURSE
const courseRoutes = [
  "router.get('/courses', verifyToken",
  "router.get('/courses/with-modules', verifyToken",
  "router.get('/courses/:id', verifyToken",
  "router.patch('/courses/:id', verifyToken",
  "router.delete('/courses/:id', verifyToken",
  "router.post('/courses', verifyToken",
  "router.post('/modules', verifyToken",
  "router.post('/lessons', verifyToken",
  "router.patch('/modules/:id', verifyToken",
  "router.delete('/modules/:id', verifyToken",
  "router.patch('/lessons/:id', verifyToken",
  "router.delete('/lessons/:id', verifyToken",
  "router.put('/courses/:id/modules/reorder', verifyToken",
  "router.put('/courses/:id/lessons/reorder', verifyToken",
  "router.put('/courses/:id/lessons/move', verifyToken"
];
courseRoutes.forEach(route => {
  content = content.replace(route, route + ", requirePermission('COURSE')");
});

// QUIZ
const quizRoutes = [
  "router.get('/quizzes', verifyToken",
  "router.post('/quizzes', verifyToken",
  "router.get('/quizzes/:id', verifyToken",
  "router.patch('/quizzes/:id', verifyToken",
  "router.delete('/quizzes/:id', verifyToken",
  "router.post('/quizzes/:id/questions', verifyToken",
  "router.put('/quizzes/:id/questions/:questionId', verifyToken",
  "router.delete('/quizzes/:id/questions/:questionId', verifyToken"
];
quizRoutes.forEach(route => {
  content = content.replace(route, route + ", requirePermission('QUIZ')");
});

// STUDENT
const studentRoutes = [
  "router.get('/students', verifyToken",
  "router.get('/students/:id', verifyToken",
  "router.patch('/students/:id', verifyToken",
  "router.patch('/students/:id/enrollments/:enrollmentId', verifyToken"
];
studentRoutes.forEach(route => {
  content = content.replace(route, route + ", requirePermission('STUDENT')");
});

// SETTINGS
const settingsRoutes = [
  "router.get('/settings', verifyToken",
  "router.post('/settings', verifyToken",
  "router.patch('/settings/:id', verifyToken"
];
settingsRoutes.forEach(route => {
  content = content.replace(route, route + ", requirePermission('SETTINGS')");
});

// GRADE
const gradeRoutes = [
  "router.get('/grades', verifyToken",
  "router.post('/grades', verifyToken",
  "router.put('/grades/reorder', verifyToken",
  "router.patch('/grades/:id', verifyToken",
  "router.delete('/grades/:id', verifyToken"
];
gradeRoutes.forEach(route => {
  content = content.replace(route, route + ", requirePermission('GRADE')");
});

fs.writeFileSync('backend/src/features/teacher/routes.js', content);
