const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const testFile = 'test.txt';
const serverUrl = 'http://localhost:3001';

async function testUpload() {
  // 1. Créer un fichier de test
  fs.writeFileSync(testFile, 'Contenu de test');

  // 2. Préparer le form-data
  const form = new FormData();
  form.append('file', fs.createReadStream(testFile));

  try {
    // 3. Envoyer la requête
    const response = await axios.post(`${serverUrl}/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Bearer VOTRE_JWT' // Si nécessaire
      }
    });

    console.log('✅ Upload réussi:', response.data);

    // 4. Tester le téléchargement
    const fileKey = response.data.filePath;
    const download = await axios.get(`${serverUrl}/files/${fileKey}`);
    console.log('✅ Téléchargement réussi. URL:', download.request.res.responseUrl);
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  } finally {
    // Nettoyage
    fs.unlinkSync(testFile);
  }
}

testUpload();