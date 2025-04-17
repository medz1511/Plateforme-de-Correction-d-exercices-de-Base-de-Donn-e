const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User  = require('./schema');
const Exam = require('../exam/schema')
const Submission = require('../submission/schema')
const { errorHandler } = require("../../utils/errorHandler");
const { sendAccountApprovalEmail } = require('../emailService');


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération des utilisateurs"));
    }
};

// 📌 Récupérer un utilisateur par ID
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id: id } });
        if (!user) return next(errorHandler(404, "Utilisateur non trouvé"));
        res.status(200).json(user);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération de l'utilisateur"));
    }
};

// 📌 Supprimer un utilisateur
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return next(errorHandler(404, "Utilisateur non trouvé"));

        await user.destroy();
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la suppression de l'utilisateur"));
    }
};

// 📌 Mettre à jour un utilisateur (y compris le mot de passe)
const updateUser = async (req, res, next) => {
    try {
        const { prenom, nom, email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(req.params.id);
        if (!user) return next(errorHandler(404, "Utilisateur non trouvé"));

        // Préparer les données de mise à jour
        let updatedData = { prenom, nom, email };

        // Si un nouveau mot de passe est fourni, on le hache avant de l'enregistrer
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Mettre à jour l'utilisateur
        await user.update(updatedData);

        res.status(200).json({ message: "Utilisateur mis à jour avec succès", user });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la mise à jour de l'utilisateur"));
    }
};

const validateProfessor = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return next(errorHandler(404, "Utilisateur non trouvé"));

        if (user.role !== "professeur") {
            return next(errorHandler(400, "Seuls les professeurs peuvent être validés"));
        }

        user.status = "active";
        await user.save();

        res.status(200).json({ message: "Professeur activé avec succès" });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la validation du professeur"));
    }
};

// 📌 Récupérer les professeurs en attente d'approbation
const getPendingProfessors = async (req, res, next) => {
    try {
        const pendingProfessors = await User.findAll({
            where: { status: "pending", role: "professor" },
            attributes: ["id", "prenom", "nom", "email", "createdAt"] // Sélectionner seulement les infos utiles
        });

        res.status(200).json(pendingProfessors);
    } catch (error) {
        console.error("Erreur lors de la récupération des professeurs en attente:", error);
        next(error);
    }
};

// 📌 Récupérer tous les professeurs (actifs ou en attente)
const getAllProfessors = async (req, res, next) => {
    try {
        const professors = await User.findAll({
            where: { role: "professor" },
            include: [
                {
                    model: Exam, // 🔥 Jointure avec Exam
                    as: "exams",
                    attributes: ["id"],
                    include: [
                        {
                            model: Submission, // 🔥 Jointure avec Submission
                            as: "submissions",
                            attributes: ["id"], // On récupère juste les ID des soumissions
                        },
                    ],
                },
            ],
        });

        // Transforme les données pour ajouter examsCount et studentsCount
        const formattedProfessors = professors.map(prof => ({
            ...prof.toJSON(),
            examsCount: prof.exams.length, // Nombre d’examens créés par le prof
            studentsCount: prof.exams.reduce((sum, exam) => sum + exam.submissions.length, 0) // 🔥 Compte les étudiants
        }));

        res.status(200).json(formattedProfessors);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération des professeurs"));
    }
};


const handleRejectProf = async (req, res, next) => {
    try {
        const { professorId } = req.params;

        // Vérifier si le professeur existe
        const professor = await User.findByPk(professorId);
        if (!professor || professor.role !== "professor") {
            return next(errorHandler(404, "Professeur non trouvé"));
        }

        // Suppression logique (soft delete) : set null sur les dépendances
        await professor.destroy();

        res.status(200).json({ message: "Compte professeur désactivé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression du professeur:", error);
        next(errorHandler(500, "Impossible de supprimer le professeur"));
    }
};

const handleToggleStatus = async (req, res, next) => {
    try {
        const { professorId } = req.params;

        // Vérifier si le professeur existe
        const professor = await User.findByPk(professorId);
        if (!professor || professor.role !== "professor") {
            return next(errorHandler(404, "Professeur non trouvé"));
        }

        // Basculement du statut : active <-> pending
        professor.status = professor.status === "active" ? "pending" : "active";
        await professor.save();

        res.status(200).json({ message: `Statut mis à jour: ${professor.status}`, professor });
    } catch (error) {
        console.error("Erreur lors du changement de statut du professeur:", error);
        next(errorHandler(500, "Impossible de modifier le statut"));
    }
};

const approveProfessor = async (req, res, next) => {
    try {
        const { professorId } = req.params;

        // 🔥 Vérifier si l'utilisateur existe et est bien un professeur
        const professor = await User.findOne({
            where: { id: professorId, role: "professor" },
        });

        if (!professor) {
            return next(errorHandler(404, "Professeur non trouvé"));
        }

        // 🔥 Vérifier si le compte est déjà activé
        if (professor.status === "active") {
            return next(errorHandler(400, "Le compte est déjà activé"));
        }

        // ✅ Mettre à jour le statut du professeur
        professor.status = "active";
        await professor.save();

        // Envoyer email de confirmation
        const emailResult = await sendAccountApprovalEmail(professor.email, professor.prenom, professor.nom);

        if (!emailResult.success) {
            // L'approbation a fonctionné mais l'email a échoué
            return res.status(200).json({
                success: true,
                message: 'Compte approuvé mais l\'email n\'a pas pu être envoyé',
                professor,
                emailError: emailResult.error
            });
        }

        res.status(200).json({
            message: `Le professeur ${professor.email} a été approuvé avec succès.`,
            professor,
        });

        // // 🔥 Envoyer un email avec Resend après activation
        // sendApprovalEmail(professor.email, professor.prenom);

    } catch (error) {
        next(errorHandler(500, "Erreur lors de l'activation du professeur : " + error.message));
    }
};


module.exports = { getAllUsers, getUserById, updateUser, deleteUser, validateProfessor, getPendingProfessors, getAllProfessors, handleRejectProf, handleToggleStatus, approveProfessor };