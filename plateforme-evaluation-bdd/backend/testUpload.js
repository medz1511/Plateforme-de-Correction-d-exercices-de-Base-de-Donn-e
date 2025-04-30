const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  const testFilePath = 'test.txt';

  try {
    fs.writeFileSync(testFilePath, 'Contenu de test avancé');

    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    const response = await axios.post('http://localhost:3001/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.TEST_TOKEN || ''}`, // Optionnel
      },
    });

    console.log('✅ Upload réussi:', response.data);

    const downloadResponse = await axios.get(response.data.url);
    console.log('✅ Téléchargement réussi:', downloadResponse.status);
  } catch (error) {
    console.error('❌ Erreur:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  } finally {
    fs.unlinkSync(testFilePath);
  }
}

testUpload();
