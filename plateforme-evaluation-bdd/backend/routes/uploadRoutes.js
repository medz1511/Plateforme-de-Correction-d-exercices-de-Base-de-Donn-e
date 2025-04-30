const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileStorage = require('../services/fileStorageServices');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { buffer, originalname, mimetype } = req.file;
  
    const fileName = `uploads/${Date.now()}-${originalname}`;

    await fileStorage.uploadFile(buffer, fileName, mimetype);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.json({
      success: true,
      filePath: fileName,
      url: fileUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
