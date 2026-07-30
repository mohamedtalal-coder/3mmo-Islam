const express = require('express');
const router = express.Router();
const coursesController = require('./controllers');

const { verifyToken } = require('../../middleware/auth');

router.get('/', coursesController.getAllCourses);
router.get('/grades', coursesController.getGrades);
router.get('/:id', coursesController.getCourseById);
router.get('/lessons/:id/comments', verifyToken, coursesController.getLessonComments);
router.post('/lessons/:id/comments', verifyToken, coursesController.createLessonComment);

module.exports = router;
