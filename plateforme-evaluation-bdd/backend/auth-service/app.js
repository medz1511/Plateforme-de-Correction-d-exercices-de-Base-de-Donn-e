require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route de base
app.get('/api/auth', (req, res) => {
    res.send('Bienvenue sur notre API AUTH !');
});

// Importer les routes

// Ouvrir Fermer Periode Parrainage
// const periodeRoutes = require('./routes/periodeRoutes');
// app.use('/api/periode', periodeRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Serveur lancé sur le port http://localhost:${PORT}`));
