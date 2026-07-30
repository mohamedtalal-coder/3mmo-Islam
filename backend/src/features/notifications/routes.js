const express = require('express');
const router = express.Router();
const controller = require('./controllers');
const { verifyToken } = require('../../middleware/auth');

router.get('/', verifyToken, controller.getNotifications);
router.get('/unread-count', verifyToken, controller.getUnreadCount);
router.patch('/read-all', verifyToken, controller.markAllAsRead);
router.patch('/:id/read', verifyToken, controller.markAsRead);

module.exports = router;
