const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../db');
const axios = require('axios');

// Configuration de multer pour le stockage des fichiers
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const studentDir = path.join(uploadDir, req.params.studentId || 'unknown');
    if (!fs.existsSync(studentDir)) {
      fs.mkdirSync(studentDir, { recursive: true });
    }
    cb(null, studentDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }
});

// Middleware pour vérifier le token d'authentification
async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Vérifier le token auprès du service d'authentification
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/verify-token`, { token });
    req.user = response.data.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

// Route pour soumettre un devoir (upload PDF)
router.post('/:studentId/submit/:subjectId', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { studentId, subjectId } = req.params;
    
    // Vérifier que l'étudiant qui soumet est bien celui qui est authentifié
    if (req.user.role !== 'admin' && req.user.role !== 'professor' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Forbidden: You can only submit for yourself' });
    }

    // Vérifier que le fichier a bien été téléchargé
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Enregistrer la soumission dans la base de données
    const [result] = await pool.query(
      `INSERT INTO submissions 
       (student_id, subject_id, file_path, original_filename, mime_type, file_size, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        studentId,
        subjectId,
        req.file.path,
        req.file.originalname,
        req.file.mimetype,
        req.file.size
      ]
    );

    const submissionId = result.insertId;

    // Envoyer une requête au service de correction pour traiter le fichier (asynchrone)
    try {
      axios.post(`${process.env.CORRECTION_SERVICE_URL}/api/corrections/process`, {
        submissionId,
        studentId,
        subjectId,
        filePath: req.file.path
      }).catch(err => {
        console.error('Error notifying correction service:', err);
        // Mettre à jour le statut en cas d'échec
        pool.query('UPDATE submissions SET status = ? WHERE id = ?', ['failed', submissionId]);
      });
    } catch (error) {
      console.error('Error notifying correction service:', error);
      // Ne pas échouer la requête principale si la notification échoue
    }

    res.status(201).json({
      message: 'Submission received successfully',
      submissionId,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error in submission:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour récupérer toutes les soumissions d'un étudiant
router.get('/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Vérifier que l'utilisateur a le droit de voir ces soumissions
    if (req.user.role !== 'admin' && req.user.role !== 'professor' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Forbidden: You can only view your own submissions' });
    }

    // Récupérer les soumissions de l'étudiant
    const [submissions] = await pool.query(
      `SELECT id, subject_id, original_filename, status, score, submitted_at, updated_at
       FROM submissions 
       WHERE student_id = ?
       ORDER BY submitted_at DESC`,
      [studentId]
    );

    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour récupérer les détails d'une soumission spécifique
router.get('/:studentId/submission/:submissionId', verifyToken, async (req, res) => {
  try {
    const { studentId, submissionId } = req.params;
    
    // Vérifier que l'utilisateur a le droit de voir cette soumission
    if (req.user.role !== 'admin' && req.user.role !== 'professor' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Forbidden: You can only view your own submissions' });
    }

    // Récupérer les détails de la soumission
    const [submissions] = await pool.query(
      `SELECT * FROM submissions WHERE id = ? AND student_id = ?`,
      [submissionId, studentId]
    );

    if (submissions.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ submission: submissions[0] });
  } catch (error) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour télécharger un fichier soumis
router.get('/:studentId/download/:submissionId', verifyToken, async (req, res) => {
  try {
    const { studentId, submissionId } = req.params;
    
    // Vérifier que l'utilisateur a le droit de télécharger ce fichier
    if (req.user.role !== 'admin' && req.user.role !== 'professor' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Forbidden: You can only download your own submissions' });
    }

    // Récupérer les informations du fichier
    const [submissions] = await pool.query(
      `SELECT file_path, original_filename FROM submissions WHERE id = ? AND student_id = ?`,
      [submissionId, studentId]
    );

    if (submissions.length === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const { file_path, original_filename } = submissions[0];

    // Vérifier que le fichier existe
    if (!fs.existsSync(file_path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Envoyer le fichier
    res.download(file_path, original_filename);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour les professeurs pour consulter toutes les soumissions pour un sujet
router.get('/subjects/:subjectId/submissions', verifyToken, async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    // Vérifier que l'utilisateur est un professeur ou admin
    if (req.user.role !== 'admin' && req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Forbidden: Only professors can view all submissions' });
    }

    // Récupérer toutes les soumissions pour ce sujet
    const [submissions] = await pool.query(
      `SELECT s.id, s.student_id, s.original_filename, s.status, s.score, s.submitted_at, s.updated_at
       FROM submissions s
       WHERE s.subject_id = ?
       ORDER BY s.submitted_at DESC`,
      [subjectId]
    );

    res.status(200).json({ submissions });
  } catch (error) {
    console.error('Error fetching subject submissions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route pour mettre à jour le statut d'une soumission (utilisée par le service de correction)
router.put('/:submissionId/status', async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, score, feedback } = req.body;
    
    // Mettre à jour le statut et les résultats dans la base de données
    await pool.query(
      `UPDATE submissions SET status = ?, score = ?, feedback = ? WHERE id = ?`,
      [status, score, feedback, submissionId]
    );

    // Si la correction est terminée, envoyer une notification
    if (status === 'completed') {
      try {
        // Récupérer les informations de la soumission
        const [submissions] = await pool.query('SELECT student_id, subject_id FROM submissions WHERE id = ?', [submissionId]);
        
        if (submissions.length > 0) {
          // Envoyer une notification via le service de notification
          axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`, {
            userId: submissions[0].student_id,
            type: 'submission_corrected',
            title: 'Votre devoir a été corrigé',
            message: `Votre soumission a été corrigée. Votre note est de ${score}/20.`,
            data: {
              submissionId,
              subjectId: submissions[0].subject_id,
              score
            }
          }).catch(err => {
            console.error('Error sending notification:', err);
          });
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    res.status(200).json({
      message: 'Submission status updated successfully',
      submissionId,
      status
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;