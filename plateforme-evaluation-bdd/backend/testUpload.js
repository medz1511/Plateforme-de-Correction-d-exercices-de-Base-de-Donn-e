const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword'
};

async function test() {
  try {
    // 1. Login
    const { token } = (await axios.post('http://localhost:3001/auth/login', {
      email: TEST_USER.email,
      password: TEST_USER.password
    })).data;

    // 2. Create test file
    fs.writeFileSync('test.txt', 'Test content');

    // 3. Prepare upload
    const form = new FormData();
    form.append('file', fs.createReadStream('test.txt'));

    // 4. Execute upload
    const response = await axios.post('http://localhost:3001/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Upload successful!', response.data);
  } catch (error) {
    console.error('❌ Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  } finally {
    if (fs.existsSync('test.txt')) fs.unlinkSync('test.txt');
  }
}

test();