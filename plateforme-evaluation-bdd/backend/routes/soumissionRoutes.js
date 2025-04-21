// backend/routes/soumissionRoutes.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const router  = express.Router();
const soumService = require('../services/soumissionService');

// Multer pour réception PDF de dépôt
const storageSoumissions = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname,'../uploads/soumissions')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const uploadSoumission = multer({ storage: storageSoumissions });

// UTILITAIRE pour récupérer l’ID de l’étudiant
function getUserId(req) {
  // 1) si authentifié via JWT/session
  if (req.user && req.user.id) return req.user.id;
  // 2) sinon, en dev, on autorise un fallback via body
  if (req.body.etudiantId) return req.body.etudiantId;
  // 3) rien → on renvoie une 400
  return null;
}

// GET /api/submissions -> lister les soumissions du user actuel (ou via body.etudiantId en dev)
router.get('/', async (req, res) => {
  try {
    const userId = (req.user && req.user.id)
      || parseInt(req.query.etudiantId, 10);
    if (!userId) {
      return res.status(400).json({ error: 'etudiantId manquant' });
    }
    const lst = await soumService.getByUser(userId);
    res.json(lst);
  } catch (err) {
    console.error("GET /soumissions :", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/allSubs', async (req, res) => res.json(await soumService.getAll()));

// GET /api/submissions/:id -> détail
router.get('/:id', async (req, res) => {
  try {
    const s = await soumService.getById(req.params.id);
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/submissions -> nouvelle soumission
router.post(
  '/',
  uploadSoumission.single('file'),
  async (req, res) => {
    try {
      // on lit userId passé dans le body
      const userId = parseInt(req.body.userId, 10);
      const sujetId = parseInt(req.body.sujetId, 10);
      if (!userId || !sujetId) {
        return res.status(400).json({ error: 'userId et sujetId requis' });
      }

      const filePath = req.file
        ? `/uploads/soumissions/${req.file.filename}`
        : '';
      const soum = await soumService.create(sujetId, userId, filePath);
      res.status(201).json(soum);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);



router.get('/stats/sub', async (req, res) => {
  try {
    const stats = await soumService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/submissions/:id -> remplacer fichier
router.put(
  '/:id',
  uploadSoumission.single('file'),
  async (req, res) => {
    try {
      const filePath = req.file ? `/uploads/soumissions/${req.file.filename}` : null;
      const data = { chemin_fichier_pdf: filePath, etat: 'SOUMIS' };
      await soumService.update(req.params.id, data);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id/correction', async (req, res) => {
  try {
    const { note_final, commentaire_prof } = req.body;
    // on met à jour note_final, commentaire_prof et l'état
    await soumService.update(req.params.id, {
      note_final,
      commentaire_prof,
      etat: 'CORRIGE'
    });
    // renvoyer la soumission mise à jour
    const updated = await soumService.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Erreur mise à jour correction :', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/submissions/:id -> retirer son dépôt
router.delete('/:id', async (req, res) => {
  try {
    await soumService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
