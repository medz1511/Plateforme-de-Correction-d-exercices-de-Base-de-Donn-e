const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileStorage = require('../services/fileStorageServices');

const upload = multer({ storage: multer.memoryStorage() });

// POST /upload/
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const fileName = `uploads/${Date.now()}-${originalname}`;
    
    await fileStorage.uploadFile(buffer, fileName, mimetype);
    
    res.json({ 
      success: true, 
      filePath: fileName,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
    });
  } catch (err) {
    console.error('Erreur upload:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;