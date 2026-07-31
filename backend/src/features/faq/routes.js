const express = require('express');
const router = express.Router();
const faqController = require('./controllers');
const { verifyToken, requireRole } = require('../../middleware/auth');

// Public routes
router.get('/public', faqController.getPublicFaqs);

// Teacher/Admin routes
router.get('/teacher', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), faqController.getTeacherFaqs);
router.post('/teacher', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), faqController.createFaq);
router.put('/teacher/:id', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), faqController.updateFaq);
router.delete('/teacher/:id', verifyToken, requireRole(['TEACHER', 'COURSE_ADMIN']), faqController.deleteFaq);

module.exports = router;
