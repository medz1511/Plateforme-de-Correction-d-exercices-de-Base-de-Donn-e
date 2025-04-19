// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./models');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());


// Auth (local)
app.use('/auth', require('./routes/authRoutes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth routes Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => { res.redirect('/'); }
);

// Auth routes GitHub
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => { res.redirect('/'); }
);

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
db.sequelize.sync().then(() =>
  app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`))
);
