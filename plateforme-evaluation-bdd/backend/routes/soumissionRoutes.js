const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const soumService = require('../services/soumissionService');
const fileStorage = require('../services/fileStorageServices'); // AWS S3

const uploadSoumission = multer({ storage: multer.memoryStorage() });

// GET /api/soumissions -> lister les soumissions du user actuel
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

// GET /api/soumissions/download?path=<path>
router.get('/download', async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: "Paramètre 'path' manquant" });
    }

    const key = path.replace(/^\/?uploads\//, '');
    const stream = await fileStorage.getFileStream(key);

    const filename = key.split('/').pop();
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', 'application/pdf');

    stream.pipe(res);
  } catch (err) {
    console.error('❌ Erreur GET /soumissions/download:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/soumissions -> nouvelle soumission avec upload S3
router.post('/', uploadSoumission.single('file'), async (req, res) => {
  try {
    const userId = parseInt(req.body.userId, 10);
    const sujetId = parseInt(req.body.sujetId, 10);
    if (!userId || !sujetId) {
      return res.status(400).json({ error: 'userId et sujetId requis' });
    }

    console.log('📥 Fichier reçu:', req.file);
    console.log('📦 Body reçu:', req.body);

    if (!req.file) {
      console.error('❌ Aucun fichier trouvé');
      return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileName = `soumissions/${Date.now()}-${originalname}`;

    console.log('🚀 Envoi vers S3:', fileName);
    await fileStorage.uploadFile(buffer, fileName, mimetype);
    console.log('✅ Upload S3 terminé');

    // Enregistrement dans la BDD
    const soum = await soumService.create(sujetId, userId, fileName);
    console.log('💾 Soumission enregistrée:', soum);

    // Génération d'une URL signée
    const signedUrl = await fileStorage.generateSignedUrl(fileName);
    console.log('🔗 Signed URL générée:', signedUrl);

    res.status(201).json({ soum, downloadUrl: signedUrl });
  } catch (err) {
    console.error('❌ Erreur POST /soumissions:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/soumissions/signed-url -> générer une signed URL à partir du chemin ou de l'id
router.get('/signed-url', async (req, res) => {
  try {
    const { path, id } = req.query;

    if (!path && !id) {
      return res.status(400).json({ error: 'Chemin ou ID requis' });
    }

    // Si chemin fourni (cas du front)
    if (path) {
      // Cas local : fichier dans /uploads/
      if (path.startsWith('uploads/')) {
        return res.json({ url: '/' + path });  // renvoie l'URL locale
      }

      // Cas S3 : génère une signed URL
      const signedUrl = await fileStorage.generateSignedUrl(path);
      return res.json({ url: signedUrl });
    }

    // Sinon, si id fourni (ancienne logique)
    const soumission = await soumService.getById(id);
    if (!soumission) {
      return res.status(404).json({ error: 'Soumission non trouvée' });
    }

    const filePath = soumission.chemin_fichier_pdf;
    const signedUrl = await fileStorage.generateSignedUrl(filePath);
    res.json({ url: signedUrl });
  } catch (err) {
    console.error('❌ Erreur GET /soumissions/signed-url:', err);
    res.status(500).json({ error: 'Erreur lors de la génération de l’URL signée.' });
  }
});

// PUT /api/soumissions/:id -> remplacer fichier (upload S3)
router.put('/:id', uploadSoumission.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileName = `soumissions/${Date.now()}-${originalname}`;

    console.log('🚀 Remplacement vers S3:', fileName);
    await fileStorage.uploadFile(buffer, fileName, mimetype);
    console.log('✅ Remplacement S3 terminé');

    const data = { chemin_fichier_pdf: fileName, etat: 'SOUMIS' };
    await soumService.update(req.params.id, data);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/soumissions/allSubs -> lister toutes les soumissions
router.get('/allSubs', async (req, res) => res.json(await soumService.getAll()));

// GET /api/soumissions/:id -> détail
router.get('/:id', async (req, res) => {
  try {
    const s = await soumService.getById(req.params.id);
    res.json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT correction
router.put('/:id/correction', async (req, res) => {
  try {
    const { note_final, commentaire_prof } = req.body;
    await soumService.update(req.params.id, {
      note_final,
      commentaire_prof,
      etat: 'CORRIGE'
    });
    const updated = await soumService.getById(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Erreur mise à jour correction :', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/soumissions/:id -> retirer son dépôt
router.delete('/:id', async (req, res) => {
  try {
    await soumService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Stats
router.get('/stats/sub', async (req, res) => {
  try {
    const stats = await soumService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
