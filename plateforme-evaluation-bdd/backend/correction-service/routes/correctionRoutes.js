// routes/correctionRoutes.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, authorizeRole } = require('../middleware/auth');

/**
 * Routes pour les soumissions
 */

// Soumettre un exercice (étudiant uniquement)



// Ajoutez ces routes au début de votre fichier correctionRoutes.js
// Route de test sans authentification
router.get('/test', (req, res) => {
    res.json({ message: 'API fonctionne correctement' });
  });
  
  // Route publique pour lister les soumissions (temporaire pour le test)
  router.get('/submissions', (req, res) => {
    res.json({ 
      message: 'Liste des soumissions (endpoint public pour test)',
      submissions: [] // Laisser vide pour le test
    });
  });







router.post(
  '/submissions',
  authenticate,
  authorizeRole('student'),
  submissionController.upload.single('pdf'),
  submissionController.submitExercise
);

// Obtenir une soumission spécifique
router.get(
  '/submissions/:id',
  authenticate,
  submissionController.getSubmission
);

// Obtenir le PDF d'une soumission
router.get(
  '/submissions/:id/pdf',
  authenticate,
  submissionController.getSubmissionPDF
);

// Réviser une soumission (professeur uniquement)
router.patch(
  '/submissions/:id/review',
  authenticate,
  authorizeRole('professor'),
  submissionController.reviewSubmission
);

// Demander une nouvelle correction (professeur uniquement)
router.post(
  '/submissions/:id/recorrect',
  authenticate,
  authorizeRole('professor'),
  submissionController.recorrectSubmission
);


// Obtenir les soumissions pour un exercice spécifique (professeur uniquement)
router.get(
  '/exercises/:exerciseId/submissions',
  authenticate,
  authorizeRole('professor'),
  submissionController.getSubmissionsByExercise
);

// Obtenir les soumissions d'un étudiant
router.get(
  '/students/:studentId/submissions',
  authenticate,
  submissionController.getSubmissionsByStudent
);

// Exposer la route pour le webhook - déclencher la correction depuis un autre service
router.post(
  '/webhooks/correction',
  async (req, res) => {
    try {
      const { submissionId, apiKey } = req.body;
      
      // Vérifier l'API key (à implémenter selon vos besoins de sécurité)
      if (apiKey !== process.env.CORRECTION_API_KEY) {
        return res.status(401).json({ message: 'Clé API invalide' });
      }
      
      if (!submissionId) {
        return res.status(400).json({ message: 'ID de soumission manquant' });
      }
      
      // Lancer la correction en arrière-plan
      submissionController.processCorrectionAsync(submissionId);
      
      res.status(202).json({
        message: 'Correction démarrée',
        submissionId
      });
    } catch (error) {
      console.error('Erreur lors de l\'appel du webhook:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
);

module.exports = router;