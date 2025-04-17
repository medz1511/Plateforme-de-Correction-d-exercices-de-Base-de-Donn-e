const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt';

// Vérification du token JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token d\'authentification requis' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Vérification que l'utilisateur est un professeur
exports.verifyProfessor = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.role !== 'PROFESSEUR') {
      return res.status(403).json({ message: 'Accès réservé aux professeurs' });
    }
    next();
  });
};

// Vérification que l'utilisateur est un étudiant
exports.verifyStudent = (req, res, next) => {
  this.verifyToken(req, res, () => {
    if (req.user.role !== 'ETUDIANT') {
      return res.status(403).json({ message: 'Accès réservé aux étudiants' });
    }
    next();
  });
};