// services/correctionService.js

const Exam = require("../exam/schema")
const Correction = require("../correction/schema")
const Grade = require("../grade/schema")
const deepSeekAI = require('../../utils/deepseek');
const { extractTextFromFile } = require('../../services/fileExtractor/fileExtractor');

const processSubmissionCorrection = async (submission, fileUrl, format) => {
    try {
        // Extraire le texte du fichier PDF
        const extractedText = await extractTextFromFile(fileUrl, format);

        console.log(`Texte extrait pour la soumission ${submission.id}`);

        // Récupérer l'examen associé
        const exam = await Exam.findByPk(submission.examId);
        if (!exam) {
            console.error(`Examen associé non trouvé pour la soumission ${submission.id}`);
            return false;
        }
        const extractedTextExam = await extractTextFromFile(exam.fileUrl, exam.format);

        // Récupérer la correction associée à l'examen
        const correction = await Correction.findOne({ where: { examId: submission.examId } });
        if (!correction) {
            console.error(`Correction de référence non trouvée pour l'examen ${submission.examId}`);
            return false;
        }

        console.log(`Envoi à DeepSeek pour la soumission ${submission.id}`);
        console.log(extractedText)
        console.log(correction)

        // DeepSeek compare la soumission avec la correction de l'examen
        const { score, feedback, is_correct, suggestions } = await deepSeekAI.gradeSubmission(
            extractedTextExam,
            extractedText,
            correction.content,

        );

        // 🚨 Gestion des erreurs de DeepSeek
        if (score === -1) {
            // Remettre la soumission en statut "assigned" pour permettre une nouvelle soumission
            submission.status = 'assigned';
            submission.content = '';
            await submission.save();

            console.log(`Soumission ${submission.id} remise à 'assigned' en raison d'une erreur`);

            // ⚡ Envoi de l'événement WebSocket pour informer l'étudiant
            global.io.emit("submissionError", {
                submissionId: submission.id,
                message: "Erreur lors du traitement du fichier. Veuillez soumettre un autre fichier."
            });

            return false;
        }

        console.log(`Résultats de DeepSeek reçus pour la soumission ${submission.id}. Score: ${score}`);

        // Mettre à jour le statut pour indiquer que la soumission a été corrigée
        submission.status = 'graded';
        await submission.save();

        // Enregistrer la note dans `Grades`
        await Grade.create({
            submissionId: submission.id,
            professorId: exam.professorId,
            score,
            feedback,
            is_correct,
            suggestions
        });

        console.log(`Correction enregistrée pour la soumission ${submission.id}`);

        // Si vous avez configuré socket.io, vous pourriez envoyer une notification ici

        return true;
    } catch (error) {
        console.error(`Erreur dans processSubmissionCorrection pour ${submission.id}:`, error);
        return false;
    }
};

module.exports = {
    processSubmissionCorrection
};