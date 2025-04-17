const { body } = require("express-validator");

const validateExam = [
    body("title").notEmpty().withMessage("Le titre est obligatoire"),
    body("deadline").optional().isISO8601().toDate(),
];

module.exports = { validateExam };
