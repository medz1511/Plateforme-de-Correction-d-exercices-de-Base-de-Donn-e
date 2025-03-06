const express = require('express');
const axios = require('axios');
const cors = require('cors');
const correctionRoutes = require('./routes/correctionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/correction', correctionRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Correction service running on port ${PORT}`);
});