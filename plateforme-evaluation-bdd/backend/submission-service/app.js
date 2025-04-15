const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const { pool, testConnection, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());  // Sécurité
app.use(cors());    // CORS pour les requêtes cross-origin
app.use(express.json());
app.use(morgan('dev'));  // Logging

// Créer le répertoire d'upload s'il n'existe pas
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Créer un dossier pour chaque étudiant
    const studentDir = path.join(uploadDir, req.body.studentId || 'unknown');
    if (!fs.existsSync(studentDir)) {
      fs.mkdirSync(studentDir, { recursive: true });
    }
    cb(null, studentDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Filtre pour accepter uniquement les fichiers PDF
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
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 } // 10MB par défaut
});

// Route pour vérifier la santé du service
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.status(200).json({
    status: 'ok',
    service: 'submission-service',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Routes pour les soumissions d'exercices
const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/submissions', submissionRoutes);

// Route globale pour gérer les erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Initialiser la base de données et démarrer le serveur
(async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Submission service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

module.exports = app;