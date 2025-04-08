const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fonction pour tester la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

// Fonction pour initialiser la table "soumission"
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS soumission (
        id INT AUTO_INCREMENT PRIMARY KEY,
        etudiant_id INT NOT NULL,
        sujet_id INT NOT NULL,
        chemin_fichier_pdf VARCHAR(255) NOT NULL,
        nom_fichier_original VARCHAR(255) NOT NULL,
        type_mime VARCHAR(100) NOT NULL,
        taille_fichier INT NOT NULL,
        etat_upload ENUM('EN_COURS', 'TERMINE', 'ERREUR') NOT NULL DEFAULT 'EN_COURS',
        etat ENUM('SOUMIS', 'CORRIGE') NOT NULL DEFAULT 'SOUMIS',
        note_automatique FLOAT DEFAULT NULL,
        commentaire_ia TEXT DEFAULT NULL,
        date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (etudiant_id),
        INDEX (sujet_id),
        INDEX (etat)
      )
    `);
    console.log('Table soumission initialized');
  } catch (err) {
    console.error('Error initializing soumission table:', err);
    throw err;
  }
}

module.exports = {
  pool,
  testConnection,
  initDatabase
};
