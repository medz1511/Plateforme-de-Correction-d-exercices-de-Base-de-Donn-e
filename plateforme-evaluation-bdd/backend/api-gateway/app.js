const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Proxy pour les microservices
app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/api/exercises', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/api/correction', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});