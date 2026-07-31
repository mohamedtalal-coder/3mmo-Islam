const express = require('express');
const router = express.Router();
const authController = require('./controllers');
const { verifyToken } = require('../../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);
router.post('/verify-email', authController.verifyEmail);

// Password Reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
