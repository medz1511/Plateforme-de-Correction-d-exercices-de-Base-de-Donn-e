const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { createWriteStream } = require('fs');
const storageConfig = require('../config/storage');

// Client S3 pour AWS ou MinIO
let s3Client;
if (storageConfig.type === 's3') {
  const options = {
    region: storageConfig.config.region,
    credentials: {
      accessKeyId: storageConfig.config.accessKeyId,
      secretAccessKey: storageConfig.config.secretAccessKey
    }
  };
  
  // Si un endpoint est spécifié (pour MinIO par exemple)
  if (storageConfig.config.endpoint) {
    options.endpoint = storageConfig.config.endpoint;
    options.forcePathStyle = true; // Nécessaire pour MinIO
  }
  
  s3Client = new S3Client(options);
}

// Upload d'un fichier
exports.uploadFile = async (filePath, destKey) => {
  if (storageConfig.type === 'local') {
    // Stockage local
    const destPath = path.join(storageConfig.config.basePath, destKey);
    const destDir = path.dirname(destPath);
    
    // Créer le répertoire de destination s'il n'existe pas
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copier le fichier
    fs.copyFileSync(filePath, destPath);
    return destKey;
  } else {
    // Stockage S3
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: storageConfig.config.bucket,
      Key: destKey,
      Body: fileContent
    };
    
    await s3Client.send(new PutObjectCommand(params));
    return destKey;
  }
};

// Téléchargement d'un fichier
exports.downloadFile = async (fileKey, destPath) => {
  if (storageConfig.type === 'local') {
    // Stockage local
    const sourcePath = path.join(storageConfig.config.basePath, fileKey);
    
    if (!fs.existsSync(sourcePath)) {
      throw new Error('Fichier non trouvé');
    }
    
    // Créer le répertoire de destination s'il n'existe pas
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copier le fichier
    fs.copyFileSync(sourcePath, destPath);
    return destPath;
  } else {
    // Stockage S3
    const params = {
      Bucket: storageConfig.config.bucket,
      Key: fileKey
    };
    
    const { Body } = await s3Client.send(new GetObjectCommand(params));
    
    // Créer le répertoire de destination s'il n'existe pas
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Écrire le fichier sur le disque
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(destPath);
      Body.pipe(writeStream);
      
      writeStream.on('finish', () => {
        resolve(destPath);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }
};

// Suppression d'un fichier
exports.deleteFile = async (fileKey) => {
  if (storageConfig.type === 'local') {
    // Stockage local
    const filePath = path.join(storageConfig.config.basePath, fileKey);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } else {
    // Stockage S3
    const params = {
      Bucket: storageConfig.config.bucket,
      Key: fileKey
    };
    
    await s3Client.send(new DeleteObjectCommand(params));
  }
};