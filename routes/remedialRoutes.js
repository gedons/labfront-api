const express = require('express');
const router = express.Router();
const { registerStudent, getStudentResults, getAllStudents, generateStudentPDF, upload, uploadDocument } = require('../controllers/remedialController');
const authenticate = require('../middlewares/authenticate');

router.post('/register', authenticate, registerStudent);
router.get('/results', authenticate, getStudentResults);
router.get('/students', authenticate, getAllStudents);
router.get('/results/pdf', authenticate, generateStudentPDF);
router.post('/upload', authenticate, upload.single('file'), uploadDocument);

module.exports = router;
