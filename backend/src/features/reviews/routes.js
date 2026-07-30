const express = require('express');
const router = express.Router();
const reviewController = require('./controllers');
const { verifyToken, requireRole } = require('../../middleware/auth');

// Public
router.get('/public', reviewController.getPublicReviews);

// Student
router.post('/student/courses/:courseId', verifyToken, requireRole(['STUDENT']), reviewController.submitReview);

// Teacher
router.get('/teacher', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), reviewController.getTeacherReviews);
router.put('/teacher/:id/approve', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), reviewController.toggleApproval);
router.delete('/teacher/:id', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), reviewController.deleteReview);

module.exports = router;
