const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { Readable } = require('stream');
const fetch = require('node-fetch'); // utile si tu veux lire des fichiers en stream

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = {
  uploadFile: async (fileBuffer, fileName, mimetype) => {
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype,
      ACL: 'bucket-owner-full-control'
    };
    await s3.send(new PutObjectCommand(uploadParams));
    return fileName;
  },

  generateSignedUrl: async (fileName) => {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1h
    return url;
  },

  // Optionnel: lire le fichier en stream depuis S3
  getFileStream: async (key) => {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    });

    const response = await s3.send(command);
    return response.Body; // Body est déjà un stream dans le SDK v3
  }
};
