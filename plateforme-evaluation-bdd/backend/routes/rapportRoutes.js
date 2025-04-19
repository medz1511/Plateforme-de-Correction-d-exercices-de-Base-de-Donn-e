// backend/routes/rapportRoutes.js
const express = require('express');
const router = express.Router();
const rapportService = require('../services/rapportService');

/**
 * GET /api/sujets/:id/rapports
 * Renvoie la liste des soumissions pour le sujet :id
 */
router.get('/sujets/:id/rapports', async (req, res) => {
  try {
    const rapports = await rapportService.getBySujet(req.params.id);
    res.json(rapports);
  } catch (err) {
    console.error('Erreur GET /sujets/:id/rapports', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
