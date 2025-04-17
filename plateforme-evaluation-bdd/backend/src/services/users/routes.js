const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser, validateProfessor, getUserByEmail, getPendingProfessors,
    handleRejectProf, getAllProfessors, handleToggleStatus, approveProfessor
} = require('./controller');
const { verifyToken, isAdmin } = require('../../middleware/auth');

const router = express.Router();

// 📌 Récupérer tous les utilisateurs (ADMIN uniquement)
router.get('/', verifyToken, isAdmin, getAllUsers);

//valider compte professeur
router.put("/validate/:id", verifyToken, isAdmin, validateProfessor);

// 📌 Récupérer tous les enseignants
router.get("/professors", verifyToken, isAdmin, getAllProfessors);

// 📌 Récupérer les enseignants en attente (ADMIN UNIQUEMENT)
router.get("/professors/pending", verifyToken, isAdmin, getPendingProfessors);

// 📌 Désactiver un compte enseignant
router.delete("/professors/:professorId", verifyToken, isAdmin, handleRejectProf);

// 📌 Activer / Désactiver un compte enseignant
router.patch("/professors/:professorId/toggle-status", verifyToken, isAdmin, handleToggleStatus);

// ✅ Route pour approuver un professeur
router.post("/professors/:professorId/approve", verifyToken, isAdmin, approveProfessor);

// 📌 Récupérer un utilisateur par ID
router.get('/:id', verifyToken, getUserById);

// 📌 Mettre à jour un utilisateur
router.put('/:id', verifyToken, updateUser);

// 📌 Supprimer un utilisateur (ADMIN uniquement)
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
