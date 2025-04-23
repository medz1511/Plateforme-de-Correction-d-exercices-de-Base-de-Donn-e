const express = require('express');
const router = express.Router();
const fileStorage = require('../services/fileStorageService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileName = `uploads/${Date.now()}-${originalname}`;
    
    await fileStorage.uploadFile(buffer, fileName, mimetype);
    res.json({ success: true, filePath: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du téléchargement' });
  }
});

router.get('/:fileKey', async (req, res) => {
  try {
    const url = await fileStorage.getFileStream(req.params.fileKey);
    res.redirect(url); // ou retourner l'URL pour le frontend
  } catch (err) {
    res.status(404).json({ error: 'Fichier non trouvé' });
  }
});

module.exports = router;