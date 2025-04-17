const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middlewares/auth');
const multer = require('multer');

// Configuration de Multer pour le stockage temporaire des fichiers
const upload = multer({ 
  dest: 'temp/',
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite à 10MB
  }
});

// Routes pour les fichiers des sujets
router.post('/subjects', authMiddleware.verifyProfessor, upload.single('file'), fileController.uploadSubject);
router.get('/subjects/:id', authMiddleware.verifyToken, fileController.getSubject);

// Routes pour les fichiers de correction
router.post('/corrections', authMiddleware.verifyProfessor, upload.single('file'), fileController.uploadCorrection);
router.get('/corrections/:id', authMiddleware.verifyToken, fileController.getCorrection);

// Routes pour les soumissions des étudiants
router.post('/submissions', authMiddleware.verifyStudent, upload.single('file'), fileController.uploadSubmission);
router.get('/submissions/:id', authMiddleware.verifyToken, fileController.getSubmission);

// Route pour supprimer un fichier
router.delete('/files/:id', authMiddleware.verifyToken, fileController.deleteFile);

module.exports = router;