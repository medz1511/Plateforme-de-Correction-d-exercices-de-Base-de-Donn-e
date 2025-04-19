// config/passport.js
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { OIDCStrategy } = require('passport-azure-ad');
const db = require('../models'); // si tu veux persister l'utilisateur

// Sérialisation/Désérialisation
passport.serializeUser((user, done) => {
  done(null, user.id || user);  // ajuster selon ton modèle Utilisateur
});
passport.deserializeUser((id, done) => {
  // si stocké en BDD, faire db.utilisateur.findByPk(id).then(user => done(null, user))
  done(null, id);
});

// Google OAuth2
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // Optionnel : créer ou récupérer l'utilisateur en BDD
    // ex: const [user] = await db.utilisateur.findOrCreate({ where:{email: profile.emails[0].value}, defaults:{prenom:profile.name.givenName, nom:profile.name.familyName} });
    done(null, profile);
  }
));

// GitHub OAuth2
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    // idem : trouver/créer user
    done(null, profile);
  }
));

// Microsoft Azure AD OpenID Connect
// passport.use(new OIDCStrategy({
//     identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
//     clientID: process.env.AZURE_CLIENT_ID,
//     clientSecret: process.env.AZURE_CLIENT_SECRET,
//     responseType: 'code',
//     responseMode: 'form_post',
//     redirectUrl: process.env.MICROSOFT_CALLBACK_URL,
//     scope: ['profile', 'offline_access', 'openid', 'email']
//   },
//   (iss, sub, profile, accessToken, refreshToken, params, done) => {
//     // profile contient les infos de l'utilisateur
//     done(null, profile);
//   }
// ));

module.exports = passport;
