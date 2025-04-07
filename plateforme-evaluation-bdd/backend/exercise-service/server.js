require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// const candidatRoutes = require('./routes/candidats.routes');
// app.use('/api', candidatRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port http://localhost:${PORT}`));
