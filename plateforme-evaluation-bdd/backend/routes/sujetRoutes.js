// backend/routes/sujetRoutes.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const router  = express.Router();
const svc     = require('../services/sujetService');
const rapportService = require('../services/rapportService');
const soumissionService = require('../services/soumissionService');

// Multer config pour stocker les PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniq}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// GET /api/sujets
router.get('/', async (req, res) => {
    try {
      const sujets = await svc.getAll();
      res.json(sujets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// GET /api/sujets/:id
router.get('/:id', async (req, res) => {
  try {
    const sujet = await svc.getById(req.params.id);
    res.json(sujet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/soumission', async (req, res) => {
  const etudiantId = req.user.id; // ou req.query.userId en dev
  const soum = await soumissionService.getBySujetAndUser(req.params.id, etudiantId);
  res.json(soum || {});
});

//  Renvoie la liste des soumissions pour le sujet :id
router.get('/:id/rapports', async (req, res) => {
  try {
    const rapports = await rapportService.getBySujet(req.params.id);
    res.json(rapports);
  } catch (err) {
    console.error('Erreur GET /sujets/:id/rapports', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sujets (créer un sujet)
router.post('/', upload.single('referenceFile'), async (req, res) => {
  try {
    const { titre, description, dateLimite, professeurId } = req.body;
    const referenceFilePath = req.file ? `/uploads/${req.file.filename}` : '';
    const nouveau = await svc.create({
      titre,
      description,
      dateLimite,
      referenceFilePath,
      professeurId
    });
    res.status(201).json(nouveau);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sujets/:id/correction-model
router.post('/:id/correction-model', upload.single('modelFile'), async (req, res) => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : '';
    const updated = await svc.uploadCorrectionModel(req.params.id, filePath);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/sujets/:id
router.put('/:id', async (req, res) => {
  try {
    const result = await svc.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/sujets/:id
router.delete('/:id', async (req, res) => {
  try {
    const count = await svc.remove(req.params.id);
    res.json({ deleted: count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
