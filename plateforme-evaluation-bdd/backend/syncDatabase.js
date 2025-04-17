require('dotenv').config(); // Très important !

const { sequelize } = require('./models');

// Force: true pour recréer les tables (attention, cela supprime toutes les données existantes)
const force = process.argv.includes('--force');

async function syncDatabase() {
  try {
    await sequelize.sync({ force });
    console.log('Base de données synchronisée avec succès.');
    
    // Si vous voulez créer des données de test
    if (process.argv.includes('--seed')) {
      console.log('Création des données de test...');
      await require('./seeders/seed')();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    process.exit(1);
  }
}

syncDatabase();