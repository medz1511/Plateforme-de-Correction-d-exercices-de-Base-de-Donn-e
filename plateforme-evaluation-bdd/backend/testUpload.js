const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  // 1. Créer un fichier test
  fs.writeFileSync('test.txt', 'Contenu de test avancé');

  // 2. Préparer la requête
  const form = new FormData();
  form.append('file', fs.createReadStream('test.txt'));

  try {
    // 3. Envoyer la requête
    const response = await axios.post('http://localhost:3001/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.TEST_TOKEN || ''}` // Optionnel
      }
    });

    console.log('✅ Upload réussi:', response.data);
    
    // 4. Tester l'accès au fichier
    const downloadResponse = await axios.get(response.data.url);
    console.log('✅ Téléchargement réussi:', downloadResponse.data);
  } catch (error) {
    console.error('❌ Erreur:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  } finally {
    fs.unlinkSync('test.txt');
  }
}

testUpload();