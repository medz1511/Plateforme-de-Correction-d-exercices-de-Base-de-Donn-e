// backend/services/authService.js
require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET      = process.env.JWT_SECRET      || 'une_clé_secrète';
const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI; // ex: http://localhost:3001/auth/google/callback
const FRONTEND_URL         = process.env.FRONTEND_URL;        // ex: http://localhost:3000

// Initialisation du client OAuth2 Google
const oAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

module.exports = {
  // --- Inscription classique ---
  register: async ({ prenom, nom, email, password }) => {
    const hash = await bcrypt.hash(password, 10);
    const firstUser = await db.utilisateur.count();
    const role = firstUser === 0 ? 'PROFESSEUR' : 'ETUDIANT';
    const user = await db.utilisateur.create({
      prenom,
      nom,
      email,
      mot_de_passe_hash: hash,
      role
    });
    return { id:user.id, prenom:user.prenom, nom:user.nom, email:user.email, role:user.role };
  },

  // --- Login classique ---
  login: async ({ email, password }) => {
    const user = await db.utilisateur.findOne({ where:{ email } });
    if (!user) throw new Error('Utilisateur introuvable');
    const valid = await bcrypt.compare(password, user.mot_de_passe_hash);
    if (!valid) throw new Error('Mot de passe invalide');
    const token = jwt.sign(
      { id:user.id, email:user.email, role:user.role },
      JWT_SECRET,
      { expiresIn:'8h' }
    );
    return { token, user:{ id:user.id, prenom:user.prenom, nom:user.nom, email:user.email, role:user.role } };
  },

  // --- Générer l’URL d’autorisation Google ---
  generateGoogleAuthUrl: () => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      prompt: 'consent'
    });
  },

  // --- Finaliser le login Google (callback) ---
  loginWithGoogle: async (code) => {
    // Échange du code contre des tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Vérification et extraction du profil
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // { sub, email, name, picture, … }

    // Recherche / création dans la BDD
    let user = await db.utilisateur.findOne({ where:{ googleId: payload.sub } });
    if (!user) {
      // Si cet email existe déjà (inscription classique), on peut lier :
      user = await db.utilisateur.findOne({ where:{ email: payload.email } });
      if (user) {
        await user.update({ googleId: payload.sub });
      } else {
        user = await db.utilisateur.create({
          prenom: payload.given_name || payload.name,
          nom:    payload.family_name || payload.name,
          email:  payload.email,
          googleId: payload.sub,
          role: 'ETUDIANT'  // ou logique différente
        });
      }
    }

    // Génération du JWT
    const token = jwt.sign(
      { id:user.id, email:user.email, role:user.role },
      JWT_SECRET,
      { expiresIn:'8h' }
    );
    return { token, user:{ id:user.id, prenom:user.prenom, nom:user.nom, email:user.email, role:user.role } };
  },

  // --- Pour valider un JWT sur chaque requête ---
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
};
