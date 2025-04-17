const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./shema');
const {errorHandler} = require("../../utils/errorHandler")

const register = async (req, res, next) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, "Erreur de validation", errors.array()));
    }

    const { prenom, nom, email, password, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(errorHandler(400, "Cet email est déjà utilisé"));
        }
        const status = role === "admin" ? "active" : "pending"; // Étudiants activés directement
        // Création de l'utilisateur
        await User.create({ prenom, nom, email, password, role, status });

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        console.error(error);
        next(errorHandler(500, "Erreur serveur"));
    }
};

const login = async (req, res, next) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler(400, "Veuillez vérifier vos informations de connexion"));
    }
    const { email, password } = req.body;

    try {
        // Recherche de l'utilisateur
        const user = await User.findOne({ where: { email } });


        // Vérification si l'utilisateur existe
        if (!user) {
            return next(errorHandler(401, "Identifiants invalides"));
        }
        // Vérification du mot de passe
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return next(errorHandler(401, "Identifiants invalides"));
        }

        // Vérifier le statut
        if (user.status !== "active") {
            return next(errorHandler(403, "Compte non activé, en attente de validation"));
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const age = 1000 * 60 * 60 * 24 * 7; // 7 jours en millisecondes

        // Réponse avec succès
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: age,
            sameSite: 'none',
            secure: true
        })
        .status(200).json({
            message: "Connexion réussie",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                prenom: user.prenom,
                nom: user.nom
            },
            token
        });

    } catch (error) {
        console.error(error);
        next(errorHandler(500, "Erreur lors de la tentative de connexion"));
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true, // Même option que lors de la création
            path: '/',      // Spécifie le chemin du cookie (par défaut à la racine)
        });
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        // Vérifier si l'utilisateur est authentifié via le token dans les cookies
        if (!req.user) {
            return res.status(401).json({ message: "Non authentifié" });
        }

        // Récupérer les infos de l'utilisateur depuis la base de données
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "prenom", "nom", "email", "role"],
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};



module.exports = { register, login, logout,  getCurrentUser};
