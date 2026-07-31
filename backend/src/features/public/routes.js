const express = require('express');
const router = express.Router();
const publicController = require('./controllers');

router.get('/home', publicController.getHomeData);
router.get('/courses/:id', publicController.getPublicCourseDetails);
router.get('/grades/all', publicController.getAllGrades);
router.get('/grades/:slug', publicController.getGradeDetails);
router.get('/certificates/verify/:number', publicController.verifyCertificate);

module.exports = router;
