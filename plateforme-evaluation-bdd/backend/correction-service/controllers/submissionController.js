// controllers/submissionController.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Submission = require('../models/Submission');
const Exercise = require('../models/Exercise');
const Feedback = require('../models/Feedback');
const DeepSeekService = require('../services/deepseekService');
const PlagiarismService = require('../services/plagiarismChecker');
const { validateSubmission } = require('../utils/validators');

// Configuration du stockage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/etudiants');
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `submission-${req.user.id}-${uniqueSuffix}${extension}`);
  }
});

// Filtrer uniquement les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

/**
 * Soumission d'un exercice par un étudiant
 * @route POST /api/submissions
 * @access Private (Student)
 */
const submitExercise = async (req, res) => {
  try {
    // Le middleware d'upload est géré séparément
    // Vérification que l'exercice existe
    const exercise = await Exercise.findById(req.body.exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercice non trouvé' });
    }

    // Vérifier si l'exercice est publié et si la date limite n'est pas dépassée
    if (!exercise.published) {
      return res.status(400).json({ message: 'Cet exercice n\'est pas disponible pour soumission' });
    }

    const now = new Date();
    if (now > new Date(exercise.deadline)) {
      return res.status(400).json({ message: 'La date limite de soumission est dépassée' });
    }

    // Vérifier si l'étudiant a déjà soumis cet exercice
    const existingSubmission = await Submission.findOne({
      student: req.user.id,
      exercise: exercise._id
    });

    if (existingSubmission) {
      // Supprimer l'ancien fichier PDF si une soumission existe déjà
      if (existingSubmission.pdfPath && fs.existsSync(existingSubmission.pdfPath)) {
        fs.unlinkSync(existingSubmission.pdfPath);
      }
      
      // Mettre à jour la soumission existante
      existingSubmission.pdfPath = req.file.path;
      existingSubmission.status = 'submitted';
      existingSubmission.submittedAt = now;
      await existingSubmission.save();
      
      return res.status(200).json({
        message: 'Soumission mise à jour avec succès',
        submission: existingSubmission
      });
    }

    // Créer une nouvelle soumission
    const newSubmission = new Submission({
      student: req.user.id,
      exercise: exercise._id,
      pdfPath: req.file.path,
      submittedAt: now,
      status: 'submitted'
    });

    await newSubmission.save();

    // Lancer le processus de correction en arrière-plan
    processCorrectionAsync(newSubmission._id);

    res.status(201).json({
      message: 'Exercice soumis avec succès',
      submission: newSubmission
    });
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    res.status(500).json({ message: 'Erreur lors de la soumission de l\'exercice', error: error.message });
  }
};

/**
 * Traitement asynchrone de la correction
 * @param {string} submissionId - ID de la soumission
 */
const processCorrectionAsync = async (submissionId) => {
  try {
    // Récupérer la soumission complète avec références
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      console.error('Soumission non trouvée pour la correction:', submissionId);
      return;
    }

    // Mettre à jour le statut
    submission.status = 'processing';
    await submission.save();

    // Récupérer l'exercice associé
    const exercise = await Exercise.findById(submission.exercise);
    if (!exercise) {
      console.error('Exercice non trouvé pour la correction:', submission.exercise);
      return;
    }

    // Vérifier s'il y a des corrections disponibles
    if (!exercise.correctionTemplates || exercise.correctionTemplates.length === 0) {
      console.error('Aucun modèle de correction disponible pour l\'exercice:', exercise._id);
      submission.status = 'submitted'; // Revenir à l'état précédent
      await submission.save();
      return;
    }

    // Vérification de plagiat (optionnelle selon l'implémentation)
    const plagiarismScore = await PlagiarismService.checkPlagiarism(submission, exercise);
    submission.plagiarismScore = plagiarismScore;

    // Correction par IA
    const correctionResult = await DeepSeekService.correctSubmission(exercise, submission);
    
    // Mettre à jour le score et le statut
    submission.aiScore = correctionResult.score;
    submission.finalScore = correctionResult.score; // Par défaut, le score final est le score de l'IA
    submission.status = 'corrected';

    // Créer le feedback détaillé
    const feedback = new Feedback({
      submission: submission._id,
      generalComments: correctionResult.feedback.generalComments,
      detailedFeedback: correctionResult.feedback.detailedFeedback,
      strengths: correctionResult.feedback.strengths,
      areasForImprovement: correctionResult.feedback.areasForImprovement
    });

    await feedback.save();
    
    // Mettre à jour la référence au feedback
    submission.feedbackId = feedback._id;
    await submission.save();

    console.log(`Correction terminée pour la soumission ${submissionId} avec un score de ${correctionResult.score}/20`);
  } catch (error) {
    console.error('Erreur lors du processus de correction:', error);
    
    // Mettre à jour le statut en cas d'erreur
    const submission = await Submission.findById(submissionId);
    if (submission) {
      submission.status = 'submitted'; // Revenir à l'état soumis pour permettre un nouvel essai
      await submission.save();
    }
  }
};

/**
 * Récupérer une soumission spécifique
 * @route GET /api/submissions/:id
 * @access Private
 * /**
 * Récupérer une soumission spécifique
 * @route GET /api/submissions/:id
 * @access Private (Student, Professor)
 */
const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'firstName lastName email')
      .populate('exercise', 'title description deadline');
    
    if (!submission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }
    
    // Vérifier les autorisations (seul l'étudiant concerné ou un professeur peut voir)
    if (req.user.role !== 'professor' && req.user.id !== submission.student._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    // Si un feedback existe, le récupérer
    let feedback = null;
    if (submission.feedbackId) {
      feedback = await Feedback.findById(submission.feedbackId);
    }
    
    res.status(200).json({
      submission,
      feedback
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la soumission:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Récupérer toutes les soumissions pour un exercice spécifique
 * @route GET /api/exercises/:exerciseId/submissions
 * @access Private (Professor)
 */
const getSubmissionsByExercise = async (req, res) => {
  try {
    if (req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    const submissions = await Submission.find({ exercise: req.params.exerciseId })
      .populate('student', 'firstName lastName email')
      .sort({ submittedAt: -1 });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Erreur lors de la récupération des soumissions:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Récupérer toutes les soumissions d'un étudiant
 * @route GET /api/students/:studentId/submissions
 * @access Private (Student, Professor)
 */
const getSubmissionsByStudent = async (req, res) => {
  try {
    // L'étudiant ne peut voir que ses propres soumissions
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    const submissions = await Submission.find({ student: req.params.studentId })
      .populate('exercise', 'title description deadline')
      .sort({ submittedAt: -1 });
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Erreur lors de la récupération des soumissions:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Récupérer le PDF d'une soumission
 * @route GET /api/submissions/:id/pdf
 * @access Private (Student, Professor)
 */
const getSubmissionPDF = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'firstName lastName');
    
    if (!submission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }
    
    // Vérifier les autorisations
    if (req.user.role !== 'professor' && req.user.id !== submission.student._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(submission.pdfPath)) {
      return res.status(404).json({ message: 'Fichier PDF non trouvé' });
    }
    
    // Envoyer le fichier
    res.sendFile(path.resolve(submission.pdfPath));
  } catch (error) {
    console.error('Erreur lors de la récupération du PDF:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Corriger manuellement une soumission (professeur)
 * @route PATCH /api/submissions/:id/review
 * @access Private (Professor)
 */
const reviewSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    const { finalScore, professorComment } = req.body;
    
    if (finalScore === undefined || finalScore < 0 || finalScore > 20) {
      return res.status(400).json({ message: 'Note invalide. La note doit être entre 0 et 20.' });
    }
    
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }
    
    // Mettre à jour le score et le statut
    submission.finalScore = parseFloat(finalScore);
    submission.status = 'reviewed';
    await submission.save();
    
    // Mettre à jour ou créer le feedback
    let feedback;
    if (submission.feedbackId) {
      feedback = await Feedback.findById(submission.feedbackId);
      feedback.professorAdjustments = {
        originalScore: submission.aiScore,
        adjustedScore: finalScore,
        justification: professorComment,
        adjustedAt: new Date()
      };
      await feedback.save();
    } else {
      feedback = new Feedback({
        submission: submission._id,
        generalComments: professorComment,
        professorAdjustments: {
          originalScore: submission.aiScore || 0,
          adjustedScore: finalScore,
          justification: professorComment,
          adjustedAt: new Date()
        }
      });
      await feedback.save();
      
      submission.feedbackId = feedback._id;
      await submission.save();
    }
    
    // Mettre à jour la base de données MySQL
    await updateMySQLDatabase(submission);
    
    res.status(200).json({
      message: 'Note et commentaires mis à jour avec succès',
      submission,
      feedback
    });
  } catch (error) {
    console.error('Erreur lors de la révision de la soumission:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

/**
 * Mise à jour de la base de données MySQL
 * @param {Object} submission - Objet soumission
 */
const updateMySQLDatabase = async (submission) => {
  const { pool } = require('../config/database');
  
  try {
    await pool.query(
      'UPDATE soumission SET note_automatique = ?, commentaire_ia = ?, etat = ? WHERE id = ?',
      [
        submission.finalScore, 
        submission.feedbackId ? 'Disponible' : null, 
        'CORRIGE',
        submission._id
      ]
    );
    
    console.log(`Base de données MySQL mise à jour pour la soumission ${submission._id}`);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la base de données MySQL:', error);
    // Continuer malgré l'erreur
  }
};

/**
 * Demander une nouvelle correction pour une soumission
 * @route POST /api/submissions/:id/recorrect
 * @access Private (Professor)
 */
const recorrectSubmission = async (req, res) => {
  try {
    if (req.user.role !== 'professor') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Soumission non trouvée' });
    }
    
    // Changer le statut pour déclencher une nouvelle correction
    submission.status = 'submitted';
    await submission.save();
    
    // Lancer la correction en arrière-plan
    processCorrectionAsync(submission._id);
    
    res.status(202).json({
      message: 'Nouvelle correction en cours',
      submission
    });
  } catch (error) {
    console.error('Erreur lors de la demande de nouvelle correction:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Export du middleware d'upload et des fonctions du contrôleur
module.exports = {
  upload,
  submitExercise,
  getSubmission,
  getSubmissionsByExercise,
  getSubmissionsByStudent,
  getSubmissionPDF,
  reviewSubmission,
  recorrectSubmission,
  processCorrectionAsync
};