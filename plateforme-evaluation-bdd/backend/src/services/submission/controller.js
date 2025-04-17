const Correction = require("../correction/schema");
const deepSeekAI = require("../../utils/deepseek");
const {errorHandler} = require("../../utils/errorHandler");
const Submission = require("./schema")
const Exam = require("../exam/schema")
const Grade = require("../grade/schema")
const User = require("../users/schema")
const { Op } = require('sequelize');
const  {io}  = require("../../index");
const {extractTextFromFile} = require("../fileExtractor/fileExtractor");
const {processSubmissionCorrection} = require("../correction/correctionService");


const createSubmission = async (req, res, next) => {
    try {
        const { examId, content } = req.body;
        const studentId = req.user.id;

        const exam = await Exam.findByPk(examId);
        if (!exam) return next(errorHandler(404, "Examen non trouvé"));

        // Vérifier si une soumission existe déjà pour cet étudiant et cet examen
        let submission = await Submission.findOne({
            where: {
                studentId,
                examId
            }
        });

        // Si la soumission existe, mettre à jour son contenu
        const extractedText = await extractTextFromFile(content, req.file.mimetype);
        if (submission) {
            await submission.update({
                extractedText,
                status: 'submitted'
            });
        }

        const correction = await Correction.findOne({ where: { examId } });
        if (!correction) return next(errorHandler(500, "Correction non trouvée"));

        // DeepSeek compare la soumission avec la correction de l'examen
        const { score, feedback, is_correct, suggestions } = await deepSeekAI.gradeSubmission(extractedText, correction.content);

        // Enregistrer la note dans `Grades`
        await Grade.create({
            submissionId: submission.id,
            professorId: exam.professorId,
            score,
            feedback,
            is_correct,
            suggestions
        });

        res.status(201).json({ message: "Soumission corrigée automatiquement", submission });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la soumission"));
    }
};

const updateSubmission = async (req, res, next) => {
    try {
        const { submissionId } = req.params;
        const { fileUrl, status } = req.body;
        const submission = await Submission.findByPk(submissionId);

        if (!submission) {
            return next(errorHandler(404, "Soumission non trouvée"));
        }

        if (submission.status === "graded") {
            return next(errorHandler(400, "L'examen a déjà été noté, vous ne pouvez plus soumettre."));
        }

        // Récupérer l'examen associé à la soumission pour obtenir le format
        const exam = await Exam.findByPk(submission.examId);
        if (!exam) {
            return next(errorHandler(404, "Examen associé non trouvé"));
        }

        const format = exam.format;

        // Si un nouveau fileUrl est fourni
        if (fileUrl) {
            // Mettre à jour l'URL du fichier
            // submission.fileUrl = fileUrl;
           // const extractedText = await extractTextFromFile(fileUrl, format);
            // Changer le statut à "completed" pour indiquer que la soumission est complète
            submission.content = fileUrl;
            console.log(submission.content)
            submission.status = "completed";
            await submission.save();

            // ⚡ Envoi de l'événement WebSocket
            global.io.emit("submissionUpdated", { submissionId, status: "completed" });

            // Répondre immédiatement au client
            res.status(200).json({
                message: "Soumission mise à jour avec succès. La correction est en cours...",
                submission
            });

            // Lancer le processus de correction en arrière-plan (asynchrone)
            console.log(`Début de la correction pour la soumission ${submissionId}`);



            // Traitement asynchrone sans attendre
            processSubmissionCorrection(submission, fileUrl, format)
                .then((success) => {
                    if (success) {
                        console.log(`Correction terminée pour la soumission ${submissionId}`);

                        // ⚡ Envoi de l'événement WebSocket après correction
                        global.io.emit("submissionUpdated", { submissionId, status: "graded" });
                    } else {
                        console.log(`Échec de la correction pour la soumission ${submissionId}`);
                    }
                })
                .catch(error => {
                    console.error(`Erreur lors de la correction de la soumission ${submissionId}:`, error);
                });
        } else {
            // Si seulement le status est mis à jour
            submission.status = status || submission.status;
            await submission.save();

            // ⚡ Envoi de l'événement WebSocket si le statut est mis à jour
            io.emit("submissionUpdated", { submissionId, status: submission.status });


            res.status(200).json({ message: "Statut de la soumission mis à jour avec succès", submission });
        }
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la mise à jour de la soumission: " + error.message));
    }
};

const deleteSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;

        const submission = await Submission.findByPk(id);
        if (!submission) return next(errorHandler(404, "Soumission non trouvée"));

        await submission.destroy();
        res.status(200).json({ message: "Soumission supprimée" });
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la suppression"));
    }
};

//L’étudiant peut voir toutes ses soumissions
const getStudentSubmissions = async (req, res, next) => {
    try {
        const studentId = req.user.id;
        const submissions = await Submission.findAll({ where: { studentId } });

        res.status(200).json(submissions);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération des soumissions"));
    }
};

const getSubmissionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const submission = await Submission.findByPk(id);
        if (!submission) return next(errorHandler(404, "Soumission non trouvée"));

        res.status(200).json(submission);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération de la soumission"));
    }
};

//professeur peut voir toutes les soumissions d un de ses exmanes
const getExamSubmissions = async (req, res, next) => {
    try {
        const { id } = req.params;

        const submissions = await Submission.findAll({
            where: { examId: id },
            include: [
                {
                    model: User,
                    as: "student", // Association définie dans les modèles
                    attributes: ["id", "prenom", "nom"] // Champs utiles de l'élève
                },
                {
                    model: Grade,
                    as: "grade", // Association définie dans les modèles
                    attributes: ["score", "feedback"] // Champs utiles de la note
                },

            ]
        });

        res.status(200).json(submissions);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération des soumissions"));
    }
};



const getAvailableExamsForStudent = async (req, res, next) => {
    try {
        const studentId = req.user.id; // 🔥 ID de l’étudiant connecté
        // Récupérer les soumissions "assigned" de cet étudiant
        const pendingSubmissions = await Submission.findAll({
            where: { studentId, status: "assigned", examId: {
                    [Op.not]: null  // Utiliser l'opérateur NOT NULL
                } },
            include: [
                {
                    model: Exam,
                    as: "exam",
                    attributes: ["id", "title", "content", "deadline","fileUrl"], // 📌 On ne récupère que l'essentiel
                }
            ],
        });

        // Vérifier si l'étudiant a des examens assignés
        if (!pendingSubmissions.length) {
            return res.status(200).json([]); // Retourne une liste vide s’il n’a aucun examen en attente
        }

        // Extraire uniquement les examens des soumissions trouvées
       // const availableExams = pendingSubmissions.map(submission => submission.exam);
        // Transformer les données pour inclure submissionId
        const availableExams = pendingSubmissions.map(sub => ({
            submissionId: sub.id,  // 🔥 ID de la soumission (important pour les sockets)
            examId: sub.exam.id,   // 📌 ID de l'examen
            title: sub.exam.title,
            content: sub.exam.content,
            deadline: sub.exam.deadline,
            fileUrl: sub.exam.fileUrl,
            status: sub.status      // 📌 "assigned" au départ
        }));
        res.status(200).json(availableExams);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des examens disponibles :", error);
        next(errorHandler(500, "Erreur lors de la récupération des examens disponibles."));
    }
};

const getSubmissionForStudent = async (req, res, next) => {
    try {
        const { examId, studentId } = req.query; // On récupère les paramètres depuis la requête

        if (!examId || !studentId) {
            return next(errorHandler(400, "ExamId et StudentId sont requis"));
        }

        // 🔍 Vérifier si une soumission existe pour cet étudiant et cet examen
        const submission = await Submission.findOne({
            where: { examId, studentId }
        });

        if (!submission) {
            return next(errorHandler(404, "Aucune soumission trouvée pour cet examen et cet étudiant."));
        }

        res.status(200).json(submission);
    } catch (error) {
        next(errorHandler(500, "Erreur lors de la récupération de la soumission"));
    }
};

const getStudentResults = async (req, res, next) => {
    try {
        const studentId = req.user.id;

        // 🔍 Récupérer toutes les soumissions de l'étudiant avec statut "completed" ou "graded"
        const submissions = await Submission.findAll({
            where: { studentId, status: ['completed', 'graded'] },
            include: [
                {
                    model: Exam,
                    as: "exam",
                    attributes: ["id", "title", "content", "fileUrl", "deadline"]
                },
                {
                    model: Grade,
                    as: "grade",
                    attributes: ["score", "feedback"],
                    include: [
                        {
                            model: User,
                            as: "professor",
                            attributes: ["prenom", "nom", "email"]
                        }
                    ]
                }
            ],
            order: [["updatedAt", "DESC"]],
        });

        if (!submissions || submissions.length === 0) {
            return res.status(200).json([]);
        }

        // 🛠️ Construire la réponse formatée
        const formattedResults = submissions.map(submission => ({
            id: submission.id,
            examId: submission.exam.id,
            title: submission.exam.title,
            content: submission.exam.content,
            submissionDate: submission.updatedAt,
            status: submission.status,
            submissionUrl: submission.fileUrl,
            grade: submission.grade ? submission.grade.score : null,
            feedback: submission.grade ? submission.grade.feedback : null,
            professor: submission.grade ? `${submission.grade.professor.prenom} ${submission.grade.professor.nom}` : null,
        }));

        res.status(200).json(formattedResults);
    } catch (error) {
        console.error("❌ Erreur récupération des résultats :", error);
        next(errorHandler(500, "Erreur lors de la récupération des résultats"));
    }
};


module.exports = { createSubmission, updateSubmission, deleteSubmission, getStudentSubmissions, getSubmissionById, getExamSubmissions, getAvailableExamsForStudent, getSubmissionForStudent, getStudentResults};


