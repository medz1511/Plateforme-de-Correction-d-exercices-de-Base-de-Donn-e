// backend/services/authService.js
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'une_clé_secrète';

module.exports = {
  register: async ({ prenom, nom, email, password }) => {
    const hash = await bcrypt.hash(password, 10);

    // Vérifie si c'est le premier utilisateur dans la base de données
    const firstUser = await db.utilisateur.count();
    const role = firstUser === 0 ? 'PROFESSEUR' : 'ETUDIANT';

    const user = await db.utilisateur.create({
      prenom,
      nom,
      email,
      mot_de_passe_hash: hash,
      role: role
    });

    return { prenom: user.prenom, nom: user.nom, email: user.email, role: user.role };
  },

  login: async ({ email, password }) => {
    const user = await db.utilisateur.findOne({ where: { email } });
    if (!user) throw new Error('Utilisateur introuvable');
    const valid = await bcrypt.compare(password, user.mot_de_passe_hash);
    if (!valid) throw new Error('Mot de passe invalide');
    
    // Génère un JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token, user: { id: user.id, prenom: user.prenom, nom: user.nom, email: user.email, role: user.role } };
  }
};