const express = require('express');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const cors = require('cors');
const exerciseRoutes = require('./routes/exerciseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Could not connect to PostgreSQL', err));

// Routes
app.use('/api/exercises', exerciseRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Exercise service running on port ${PORT}`);
});