const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL; // ex: http://localhost:5173

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_REDIRECT_URI
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cherche ou crée l'utilisateur
      let user = await db.utilisateur.findOne({ where: { email: profile.emails[0].value } });
      if (!user) {
        const randomPass = crypto.randomBytes(16).toString('hex');
        const hash       = await bcrypt.hash(randomPass, 10);
        const firstUser = await db.utilisateur.count();
        const role = firstUser === 0 ? 'PROFESSEUR' : 'ETUDIANT';
        user = await db.utilisateur.create({
          prenom: profile.name.givenName,
          nom: profile.name.familyName,
          email: profile.emails[0].value,
          mot_de_passe_hash: hash,
          role,
          googleId: profile.id
        });
      }
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }
));

// Sérialisation (on ne stocke pas le mot de passe !)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.utilisateur.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
