const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
app.use('/api/storage', fileRoutes);

// Route de base pour vérifier que le service fonctionne
app.get('/', (req, res) => {
  res.send('Storage Service is running!');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke in the storage service!');
});

app.listen(PORT, () => {
  console.log(`Storage service running on port ${PORT}`);
});

module.exports = app;