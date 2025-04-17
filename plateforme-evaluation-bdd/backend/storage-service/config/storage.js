const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuration pour différents types de stockage
const storageConfig = {
  // Stockage local
  local: {
    basePath: process.env.LOCAL_STORAGE_PATH || path.join(__dirname, '../uploads'),
    // Assurez-vous que le dossier existe
    init: () => {
      const dirs = ['subjects', 'corrections', 'submissions'];
      
      if (!fs.existsSync(storageConfig.local.basePath)) {
        fs.mkdirSync(storageConfig.local.basePath, { recursive: true });
      }
      
      // Créer les sous-dossiers
      dirs.forEach(dir => {
        const dirPath = path.join(storageConfig.local.basePath, dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
      });
    }
  },
  
  // Configuration pour S3 (AWS, MinIO, etc.)
  s3: {
    bucket: process.env.S3_BUCKET || 'plateforme-evaluation-files',
    region: process.env.S3_REGION || 'eu-west-3',
    endpoint: process.env.S3_ENDPOINT || null, // Pour MinIO ou autres services S3 compatibles
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
};

// Type de stockage choisi (local ou s3)
const storageType = process.env.STORAGE_TYPE || 'local';

// Initialisation du stockage local si nécessaire
if (storageType === 'local') {
  storageConfig.local.init();
}

module.exports = {
  config: storageConfig[storageType],
  type: storageType
};