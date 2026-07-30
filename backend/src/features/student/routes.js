const express = require('express');
const router = express.Router();
const studentController = require('./controllers');
const { verifyToken } = require('../../middleware/auth');

router.get('/dashboard', verifyToken, studentController.getDashboardData);
router.get('/courses', verifyToken, studentController.getStudentCourses);
router.get('/courses/:id', verifyToken, studentController.getStudentCourseDetails);
router.get('/quizzes/:id', verifyToken, studentController.getStudentQuiz);
router.post('/quizzes/:id/submit', verifyToken, studentController.submitStudentQuiz);

router.get('/certificates', verifyToken, studentController.getStudentCertificates);
router.get('/lessons/:lessonId/video', verifyToken, studentController.getLessonVideo);
router.post('/progress', verifyToken, studentController.toggleLessonProgress);
router.post('/enroll', verifyToken, studentController.enrollCourse);
router.put('/profile', verifyToken, studentController.updateProfile);

module.exports = router;
