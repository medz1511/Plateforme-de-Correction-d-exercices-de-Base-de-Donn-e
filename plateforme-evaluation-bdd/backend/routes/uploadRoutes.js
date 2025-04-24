const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileStorage = require('../services/fileStorageServices');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileName = `uploads/${Date.now()}-${originalname}`;
    
    await fileStorage.uploadFile(buffer, fileName, mimetype);
    res.json({ success: true, filePath: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:fileKey', async (req, res) => {
  try {
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.params.fileKey}`;
    res.redirect(url);
  } catch (err) {
    res.status(404).json({ error: 'Fichier non trouvé' });
  }
});

module.exports = router;