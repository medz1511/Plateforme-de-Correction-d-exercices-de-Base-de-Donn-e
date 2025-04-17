const express = require("express");
const { updateGrade, getGrade } = require("./controller");
const { verifyToken, isProfessor } = require("../../middleware/auth");

const router = express.Router();

// 📌 Modifier la note et ajouter un feedback (Professeur uniquement)
router.put("/:submissionId", verifyToken, isProfessor, updateGrade);

// 📌 Voir la note d’une soumission
router.get("/:submissionId", verifyToken, getGrade);

module.exports = router;
