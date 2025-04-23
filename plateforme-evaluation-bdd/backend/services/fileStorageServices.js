const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
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
      ContentType: mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    return fileName; // ou retourner l'URL complète si besoin
  },

  getFileStream: async (fileKey) => {
    const downloadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey
    };

    // Génère une URL signée valable 1h
    return await getSignedUrl(s3Client, new GetObjectCommand(downloadParams), { expiresIn: 3600 });
  },

  deleteFile: async (fileKey) => {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    return true;
  }
};