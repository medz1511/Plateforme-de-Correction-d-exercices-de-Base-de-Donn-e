// backend/routes/authRoutes.js
const router = require('express').Router();
const authSvc = require('../services/authService');
const db = require('../models');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const passport      = require('passport');
const jwt     = require('jsonwebtoken');          // ← voilà l’import qui manquait
const JWT_SECRET = process.env.JWT_SECRET; 
require('../config/passport');

// Sessions
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport init
router.use(passport.initialize());
router.use(passport.session());

// Inscription
router.post('/register', async (req, res) => {
  try {
    const user = await authSvc.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login classique
router.post('/login', async (req, res) => {
  try {
    const payload = await authSvc.login(req.body);
    res.json(payload);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// // URL autorisation Google
// router.get('/google/url', (req, res) => {
//   const url = authSvc.generateGoogleAuthUrl();
//   res.json({ url });
// });

router.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

// Callback Google OAuth
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}` }),
  (req, res) => {
    // Génère un token JWT
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    // Redirige vers le front avec le token en query
    // console.log ( token, user={ id:req.user.id, prenom:req.user.prenom, nom:req.user.nom, email:req.user.email, role:req.user.role } );
    // res.json ( token, user={ id:req.user.id, prenom:req.user.prenom, nom:req.user.nom, email:req.user.email, role:req.user.role } );
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}&role=${req.user.role}&prenom=${req.user.prenom}&nom=${req.user.nom}&email=${req.user.email}&id=${req.user.id}`);
  }
);

// // Point d’entrée pour récupérer le profil
// router.get('/me', async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ error:'Token manquant' });
//   }
//   const token = authHeader.split(' ')[1];
//   const payload = authSvc.verifyToken(token);
//   if (!payload) return res.status(401).json({ error:'Token invalide' });
//   const user = await db.utilisateur.findByPk(payload.id, {
//     attributes:['id','prenom','nom','email','role']
//   });
//   res.json(user);
// });

// Logout (côté client supprime simplement le token)
router.get('/logout', (req, res) => {
  res.json({ message:'Déconnecté' });
});

module.exports = router;
