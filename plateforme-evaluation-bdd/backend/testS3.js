const { S3Client, PutObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function testS3() {
  try {
    // 1. Liste tous vos buckets pour vérifier la connexion
    const buckets = await s3.send(new ListBucketsCommand({}));
    console.log('Buckets disponibles:', buckets.Buckets.map(b => b.Name));

    // 2. Essaye d'uploader un fichier
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'test.txt',
      Body: 'Ceci est un test de connexion S3',
      ContentType: 'text/plain'
    };

    console.log(`Tentative d'upload vers ${uploadParams.Bucket}...`);
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log('✅ Upload réussi! Résultat:', result);
    
    // 3. Génère une URL pour accéder au fichier
    const url = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    console.log('URL du fichier:', url);
  } catch (err) {
    console.error('❌ Erreur:', err.name, '-', err.message);
    
    if (err.name === 'NoSuchBucket') {
      console.log('\nSolution:');
      console.log('1. Allez sur https://s3.console.aws.amazon.com/');
      console.log(`2. Créez un bucket nommé "${process.env.S3_BUCKET_NAME}"`);
      console.log(`3. Région: "${process.env.AWS_REGION}"`);
    } else if (err.name === 'InvalidAccessKeyId') {
      console.log('\nSolution: Vérifiez vos clés AWS dans .env');
    }
  }
}

testS3();