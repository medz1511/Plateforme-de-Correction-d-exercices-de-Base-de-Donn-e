const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const svc     = require('../services/sujetService');
const rapportService = require('../services/rapportService');
const soumissionService = require('../services/soumissionService');
const fileStorage = require('../services/fileStorageServices'); // AWS S3

// Multer pour upload en mémoire
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/sujets/:id/signed-url -> Génère la signed URL du fichier sujet donné par le professeur
router.get('/:id/signed-url', async (req, res) => {
  try {
    const sujet = await svc.getById(req.params.id);
    if (!sujet || !sujet.chemin_fichier_pdf) {
      return res.status(404).json({ error: "Sujet introuvable ou fichier manquant." });
    }

    const cleanPath = sujet.chemin_fichier_pdf.replace(/^\/?uploads\//, '');
    console.log('📝 Chemin nettoyé:', cleanPath);
    const signedUrl = await fileStorage.generateSignedUrl(cleanPath);
    res.json({ url: signedUrl });
  } catch (err) {
    console.error('❌ Erreur GET /sujets/:id/signed-url:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/sujets/:id/model-signed-url -> Génère la signed URL du modèle de correction
router.get('/:id/model-signed-url', async (req, res) => {
  try {
    const sujet = await svc.getById(req.params.id);
    if (!sujet || !sujet.chemin_fichier_correction_pdf) {
      return res.status(404).json({ error: "Modèle de correction introuvable" });
    }

    const signedUrl = await fileStorage.generateSignedUrl(sujet.chemin_fichier_correction_pdf);
    res.json({ url: signedUrl });
  } catch (err) {
    console.error('❌ Erreur GET /sujets/:id/model-signed-url:', err);
    res.status(500).json({ error: err.message });
  }
});

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

// GET /api/sujets/:id/soumission
router.get('/:id/soumission', async (req, res) => {
  const etudiantId = req.user.id;
  const soum = await soumissionService.getBySujetAndUser(req.params.id, etudiantId);
  res.json(soum || {});
});

// GET /api/sujets/:id/rapports
router.get('/:id/rapports', async (req, res) => {
  try {
    const rapports = await rapportService.getBySujet(req.params.id);
    res.json(rapports);
  } catch (err) {
    console.error('Erreur GET /sujets/:id/rapports', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sujets (créer un sujet avec upload S3)
router.post('/', upload.single('referenceFile'), async (req, res) => {
  try {
    const { titre, description, dateLimite, professeurId } = req.body;
    let referenceFilePath = null;

    if (req.file) {
      const { buffer, originalname, mimetype } = req.file;
      const fileName = `sujets/${Date.now()}-${originalname}`;
      await fileStorage.uploadFile(buffer, fileName, mimetype);
      referenceFilePath = fileName;
    }

    const nouveau = await svc.create({
      titre,
      description,
      dateLimite,
      referenceFilePath,
      professeurId
    });

    res.status(201).json(nouveau);
  } catch (err) {
    console.error('Erreur POST /sujets:', err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/sujets/:id/correction-model -> Upload modèle de correction vers S3 (dossier models/)
router.post('/:id/correction-model', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const { buffer, originalname, mimetype } = req.file;
    const updated = await svc.uploadCorrectionModel(req.params.id, buffer, originalname, mimetype);

    res.json(updated);
  } catch (err) {
    console.error('Erreur POST /sujets/:id/correction-model:', err);
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
