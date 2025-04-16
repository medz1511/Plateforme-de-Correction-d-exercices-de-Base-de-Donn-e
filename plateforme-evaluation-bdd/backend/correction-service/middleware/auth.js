// middleware/auth.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Middleware pour vérifier le token JWT et authentifier l'utilisateur
 */
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    
    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      
      // Vérifier si l'utilisateur existe toujours
      const [rows] = await pool.query(
        'SELECT id, nom, prenom, email, role FROM utilisateur WHERE id = ?',
        [decoded.id]
      );
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Ajouter l'utilisateur à l'objet request
      req.user = {
        id: rows[0].id,
        firstName: rows[0].prenom,
        lastName: rows[0].nom,
        email: rows[0].email,
        role: rows[0].role === 'ETUDIANT' ? 'student' : 'professor'
      };
      
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 * @param {string|Array} roles - Rôle(s) autorisé(s)
 */
const authorizeRole = (roles) => {
  return (req, res, next) => {
    console.log('Middleware d\'autorisation appelé pour le rôle:', roles);
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    
    if (!rolesArray.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRole
};