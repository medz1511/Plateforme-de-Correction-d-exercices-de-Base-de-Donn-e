const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Clé de chiffrement et vecteur d'initialisation
// Ces valeurs doivent être stockées en sécurité (variables d'environnement)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'votre-clé-de-chiffrement-de-32-caractères';
const IV_LENGTH = 16; // Pour AES, c'est toujours 16

// Chiffrement d'un fichier
exports.encryptFile = async (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  
  // Générer un IV aléatoire
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Créer un chiffreur
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Chiffrer le contenu
  let encrypted = cipher.update(fileContent);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Combiner IV et contenu chiffré
  const result = Buffer.concat([iv, encrypted]);
  
  // Écrire le fichier chiffré
  const encryptedFilePath = `${filePath}.enc`;
  fs.writeFileSync(encryptedFilePath, result);
  
  return encryptedFilePath;
};

// Déchiffrement d'un fichier
exports.decryptFile = async (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  
  // Extraire l'IV (les 16 premiers octets)
  const iv = fileContent.slice(0, IV_LENGTH);
  
  // Extraire le contenu chiffré (le reste)
  const encryptedContent = fileContent.slice(IV_LENGTH);
  
  // Créer un déchiffreur
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  
  // Déchiffrer le contenu
  let decrypted = decipher.update(encryptedContent);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  // Écrire le fichier déchiffré
  const decryptedFilePath = `${filePath}.dec`;
  fs.writeFileSync(decryptedFilePath, decrypted);
  
  return decryptedFilePath;
};