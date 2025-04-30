require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./models');

const app = express();

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware d'authentification
const { verifyToken } = require('./services/authService');
app.use((req, res, next) => {
  const p = req.path.toLowerCase();

  // Routes non protégées
  if (
    p.startsWith('/auth') ||
    p.startsWith('/upload') ||
    p.startsWith('/ia')
  ) {
    return next();
  }

  // Vérification du token
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
app.use('/ia', require('./routes/iaRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/upload', require('./routes/uploadRoutes'));
app.use('/utilisateurs', require('./routes/utilisateurRoutes'));
app.use('/sujets', require('./routes/sujetRoutes'));
app.use('/soumissions', require('./routes/soumissionRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/logs', require('./routes/logActiviteRoutes'));
app.use('/parametre_ia', require('./routes/parametreIARoutes'));
app.use('/stats', require('./routes/statisticsRoutes'));
app.use('/rapport', require('./routes/rapportRoutes'));

// Lancer le serveur
const PORT = process.env.PORT || 3001;
db.sequelize.sync({ alter: false })
  .then(() => {
    console.log('📦 Base de données connectée et synchronisée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à la BDD :', err);
  });
