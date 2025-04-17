const {errorHandler} = require("../../utils/errorHandler");
const {Grade} = require("./schema");


// Le professeur peut modifier la note

const updateGrade = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { score } = req.body;
        const professorId = req.user.id;

        const grade = await Grade.findOne({ where: { submissionId } });
        if (!grade) return next(errorHandler(404, "Note non trouvée"));

        await grade.update({ score, professorId });

        res.status(200).json({ message: "Note mise à jour", grade });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la mise à jour de la note"));
    }
};

//L’étudiant peut voir sa note et si elle a été modifiée par un professeur.
const getGrade = async (req, res, next) => {
    try {
        const { submissionId } = req.params;

        const grade = await Grade.findOne({ where: { submissionId } });
        if (!grade) return next(errorHandler(404, "Note non trouvée"));

        res.status(200).json(grade);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération de la note"));
    }
};

module.exports = { updateGrade, getGrade };

