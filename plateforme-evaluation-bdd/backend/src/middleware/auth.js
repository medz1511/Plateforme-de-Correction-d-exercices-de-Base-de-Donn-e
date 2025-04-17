const jwt = require('jsonwebtoken');
const User = require('../services/auth/shema');
const { errorHandler } = require('../utils/errorHandler');

const SECRET_KEY = "xyxzFIqoD5quJOlmNXbNMHPQiIdFRGGj" || 'secret_jwt_key';

// 📌 Vérifier le token JWT
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;
        console.log(token);
        if (!token) return next(errorHandler(401, "Accès non autorisé"));

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        console.log(req.user)
        next();


    } catch (error) {
        next(errorHandler(403, "Token invalide"));
    }
};

// 📌 Vérifier si l'utilisateur est admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || user.role !== 'admin') {
            return next(errorHandler(403, "Accès refusé : Administrateur requis"));
        }
        next();
    } catch (error) {
        next(errorHandler(500, "Erreur de vérification des permissions"));
    }
};

const isProfessor = (req, res, next) => {
    if (req.user.role !== "professor") {
        return next(errorHandler(403, "Accès refusé : Professeur requis"));
    }
    next();
};

const isStudent = (req, res, next) => {
    console.log(req.user)
    if (req.user.role !== "student") {
        return next(errorHandler(403, "Accès refusé : Étudiant requis"));
    }
    next();
};

module.exports = { verifyToken, isAdmin, isStudent, isProfessor };
