// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const passport = require('./config/passport');
const db = require('./models');
const app = express();
const path = require('path');
const uploadRoutes = require('./routes/uploadRoutes');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // Sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

// // Passport init
// app.use(passport.initialize());
// app.use(passport.session());

const { verifyToken } = require('./services/authService');

app.use((req, res, next) => {
  const p = req.path.toLowerCase();

  // EXCLUSIONS :  
  //   · toutes les routes d’authent (login, register, logout)  
  //   · l’upload/accès aux fichiers statiques  
  //   · nos endpoints IA  
  if (
    p.startsWith('/auth')   ||  // /auth/*
    p.startsWith('/upload') ||  // /upload* + /uploads/*
    p.startsWith('/uploads')||
    p.startsWith('/ia')     // <-- on exclut désormais /api/ia/*
  ) {
    return next();
  }

  // Pour toutes les autres, on vérifie le token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  // on attache les infos utilisateur au req
  req.user = payload;
  next();
});




const iaRoutes = require('./routes/iaRoutes');
app.use('/ia', iaRoutes);


// Auth (local)
app.use('/auth', require('./routes/authRoutes'));

//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use('/files', require('./routes/uploadRoutes'));

app.use('/upload', require('./routes/uploadRoutes'));


// // Auth routes Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile','email'] })
// );
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req, res) => { res.redirect('/'); }
// );

// // Auth routes GitHub
// app.get('/auth/github',
//   passport.authenticate('github', { scope: ['user:email'] })
// );
// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   (req, res) => { res.redirect('/'); }
// );

// // Auth routes Microsoft
// app.get('/auth/microsoft',
//   passport.authenticate('azuread-openidconnect')
// );
// app.post('/auth/microsoft/callback',
//   passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
//   (req, res) => { res.redirect('/'); }
// );

// Route de logout
app.get('/auth/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/login');
  });
});


// Tes routes existantes
app.use('/utilisateurs', require('./routes/utilisateurRoutes'));
app.use('/sujets', require('./routes/sujetRoutes'));
app.use('/soumissions', require('./routes/soumissionRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/logs', require('./routes/logActiviteRoutes'));
app.use('/parametre_ia', require('./routes/parametreIARoutes'));
const statisticsRoutes = require('./routes/statisticsRoutes');
app.use('/stats', statisticsRoutes);
app.use('/rapport', require('./routes/rapportRoutes'));

const PORT = process.env.PORT || 3001;
db.sequelize.sync({ alter: false })  // ou { force: true } en dev si besoin
  .then(() => {
    console.log('📦 Base de données connectée et synchronisée');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à la BDD :', err);
  });
