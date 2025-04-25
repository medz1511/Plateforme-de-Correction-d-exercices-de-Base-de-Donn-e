// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer'); // Ajout de multer
const db = require('./models');
const app = express();
const path = require('path');

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration de multer pour les uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware d'authentification
const { verifyToken } = require('./services/authService');
app.use((req, res, next) => {
  const p = req.path.toLowerCase();

  // Routes exemptées d'authentification
  if (
    p.startsWith('/auth') ||
    p.startsWith('/upload') ||
    p.startsWith('/ia')
  ) {
    return next();
  }

  // Vérification du token pour les autres routes
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  req.user = payload;
  next();
});

// Import des routes
const iaRoutes = require('./routes/iaRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Configuration des routes
app.use('/ia', iaRoutes);
app.use('/auth', authRoutes);

// Route d'upload - version simplifiée pour test
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Simuler le stockage S3 pour test
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${Date.now()}-${req.file.originalname}`;
    
    res.json({ 
      success: true, 
      filePath: req.file.originalname,
      url: fileUrl
    });
  } catch (err) {
    console.error('Erreur upload:', err);
    res.status(500).json({ error: err.message });
  }
});

// Routes existantes
app.use('/utilisateurs', require('./routes/utilisateurRoutes'));
app.use('/sujets', require('./routes/sujetRoutes'));
app.use('/soumissions', require('./routes/soumissionRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/logs', require('./routes/logActiviteRoutes'));
app.use('/parametre_ia', require('./routes/parametreIARoutes'));
app.use('/stats', require('./routes/statisticsRoutes'));
app.use('/rapport', require('./routes/rapportRoutes'));

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
db.sequelize.sync({ alter: false })
  .then(() => {
    console.log('📦 Base de données connectée et synchronisée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log('Route upload test: POST http://localhost:3001/upload');
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à la BDD :', err);
  });