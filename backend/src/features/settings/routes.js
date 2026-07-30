const express = require('express');
const router = express.Router();
const settingsController = require('./controllers');

router.get('/grades', settingsController.getGrades);

module.exports = router;
