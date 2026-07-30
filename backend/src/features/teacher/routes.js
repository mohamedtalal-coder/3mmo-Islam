const express = require('express');
const router = express.Router();
const teacherController = require('./controllers');
const { verifyToken, requirePermission } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.get('/dashboard', verifyToken, requirePermission('DASHBOARD'), teacherController.getDashboardData);
router.get('/courses', verifyToken, requirePermission('COURSE'), teacherController.getTeacherCourses);
router.get('/courses/with-modules', verifyToken, requirePermission('COURSE'), teacherController.getCoursesWithModules);
router.get('/courses/:id', verifyToken, requirePermission('COURSE'), teacherController.getTeacherCourseDetails);
router.patch('/courses/:id', verifyToken, requirePermission('COURSE'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), teacherController.updateCourse);
router.delete('/courses/:id', verifyToken, requirePermission('COURSE'), teacherController.deleteCourse);
router.post('/courses', verifyToken, requirePermission('COURSE'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'attachments', maxCount: 10 }]), teacherController.createCourse);
router.post('/modules', verifyToken, requirePermission('COURSE'), teacherController.createModule);
router.post('/lessons', verifyToken, requirePermission('COURSE'), teacherController.createLesson);
router.patch('/modules/:id', verifyToken, requirePermission('COURSE'), teacherController.updateModule);
router.delete('/modules/:id', verifyToken, requirePermission('COURSE'), teacherController.deleteModule);
router.patch('/lessons/:id', verifyToken, requirePermission('COURSE'), teacherController.updateLesson);
router.delete('/lessons/:id', verifyToken, requirePermission('COURSE'), teacherController.deleteLesson);
router.get('/quizzes', verifyToken, requirePermission('QUIZ'), teacherController.getQuizzes);
router.post('/quizzes', verifyToken, requirePermission('QUIZ'), teacherController.createQuiz);
router.get('/quizzes/:id', verifyToken, requirePermission('QUIZ'), teacherController.getQuizDetail);
router.patch('/quizzes/:id', verifyToken, requirePermission('QUIZ'), teacherController.updateQuiz);
router.delete('/quizzes/:id', verifyToken, requirePermission('QUIZ'), teacherController.deleteQuiz);
router.put('/courses/:id/modules/reorder', verifyToken, requirePermission('COURSE'), teacherController.reorderModules);
router.put('/courses/:id/lessons/reorder', verifyToken, requirePermission('COURSE'), teacherController.reorderLessons);
router.put('/courses/:id/lessons/move', verifyToken, requirePermission('COURSE'), teacherController.moveLesson);

router.get('/students', verifyToken, requirePermission('STUDENT'), teacherController.getStudents);
router.get('/students/:id', verifyToken, requirePermission('STUDENT'), teacherController.getStudentDetail);
router.patch('/students/:id', verifyToken, requirePermission('STUDENT'), teacherController.updateStudentAccountStatus);
router.patch('/students/:id/enrollments/:enrollmentId', verifyToken, requirePermission('STUDENT'), teacherController.updateEnrollmentStatus);

router.get('/settings', verifyToken, requirePermission('SETTINGS'), teacherController.getSettings);
router.post('/settings', verifyToken, requirePermission('SETTINGS'), teacherController.createSettings);
router.patch('/settings/:id', verifyToken, requirePermission('SETTINGS'), teacherController.updateSettings);

// Grades Management
router.get('/grades', verifyToken, requirePermission('GRADE'), teacherController.getGrades);
router.post('/grades', verifyToken, requirePermission('GRADE'), teacherController.createGrade);
router.put('/grades/reorder', verifyToken, requirePermission('GRADE'), teacherController.reorderGrades);
router.patch('/grades/:id', verifyToken, requirePermission('GRADE'), teacherController.updateGrade);
router.delete('/grades/:id', verifyToken, requirePermission('GRADE'), teacherController.deleteGrade);


router.post('/quizzes/:id/questions', verifyToken, requirePermission('QUIZ'), teacherController.createQuestion);
router.put('/quizzes/:id/questions/:questionId', verifyToken, requirePermission('QUIZ'), teacherController.updateQuestion);
router.delete('/quizzes/:id/questions/:questionId', verifyToken, requirePermission('QUIZ'), teacherController.deleteQuestion);

module.exports = router;
