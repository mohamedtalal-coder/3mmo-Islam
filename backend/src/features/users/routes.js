const express = require('express');
const router = express.Router();
const usersController = require('./controllers');
const { verifyToken } = require('../../middleware/auth');

router.put('/profile', verifyToken, usersController.updateProfile);

module.exports = router;
