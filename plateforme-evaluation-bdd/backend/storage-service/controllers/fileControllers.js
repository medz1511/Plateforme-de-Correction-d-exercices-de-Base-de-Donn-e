const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');
const storageService = require('../services/storageService');
const encryptionService = require('../services/encryptionService');

// Gestion des uploads de sujets
exports.uploadSubject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
    }

    const { subjectId } = req.body;
    if (!subjectId) {
      return res.status(400).json({ message: 'ID du sujet requis' });
    }

    // Vérification que le sujet existe et appartient au professeur
    const [rows] = await pool.execute(
      'SELECT * FROM sujet WHERE id = ? AND professeur_id = ?',
      [subjectId, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sujet non trouvé ou non autorisé' });
    }

    // Chiffrement du fichier
    const encryptedFilePath = await encryptionService.encryptFile(req.file.path);
    
    // Upload vers le stockage
    const fileKey = `subjects/${subjectId}_${Date.now()}${path.extname(req.file.originalname)}`;
    const uploadResult = await storageService.uploadFile(encryptedFilePath, fileKey);
    
    // Mise à jour de la base de données
    await pool.execute(
      'UPDATE sujet SET chemin_fichier_pdf = ? WHERE id = ?',
      [fileKey, subjectId]
    );

    // Nettoyage des fichiers temporaires
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(encryptedFilePath);

    res.status(200).json({ 
      message: 'Sujet téléchargé avec succès',
      filePath: fileKey
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du sujet:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du sujet' });
  }
};

// Récupération d'un sujet
exports.getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérification que le sujet existe
    const [rows] = await pool.execute(
      'SELECT chemin_fichier_pdf FROM sujet WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sujet non trouvé' });
    }

    const filePath = rows[0].chemin_fichier_pdf;
    
    // Téléchargement du fichier du stockage
    const tempFilePath = path.join('temp', `${Date.now()}_${path.basename(filePath)}`);
    await storageService.downloadFile(filePath, tempFilePath);
    
    // Déchiffrement du fichier
    const decryptedFilePath = await encryptionService.decryptFile(tempFilePath);
    
    // Envoi du fichier au client
    res.download(decryptedFilePath, `sujet_${id}.pdf`, () => {
      // Nettoyage après envoi
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(decryptedFilePath);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du sujet:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du sujet' });
  }
};

// Les fonctions pour les corrections et les soumissions suivent la même logique
// uploadCorrection, getCorrection, uploadSubmission, getSubmission

// Suppression d'un fichier
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    
    let table, idColumn, pathColumn;
    
    // Déterminer la table et les colonnes en fonction du type
    switch (type) {
      case 'subject':
        table = 'sujet';
        idColumn = 'id';
        pathColumn = 'chemin_fichier_pdf';
        break;
      case 'correction':
        table = 'sujet';
        idColumn = 'id';
        pathColumn = 'chemin_fichier_correction_pdf';
        break;
      case 'submission':
        table = 'soumission';
        idColumn = 'id';
        pathColumn = 'chemin_fichier_pdf';
        break;
      default:
        return res.status(400).json({ message: 'Type de fichier non valide' });
    }
    
    // Vérification des permissions et récupération du chemin
    let query, params;
    
    if (req.user.role === 'PROFESSEUR' && (type === 'subject' || type === 'correction')) {
      query = `SELECT ${pathColumn} FROM ${table} WHERE ${idColumn} = ? AND professeur_id = ?`;
      params = [id, req.user.id];
    } else if (req.user.role === 'ETUDIANT' && type === 'submission') {
      query = `SELECT ${pathColumn} FROM ${table} WHERE ${idColumn} = ? AND etudiant_id = ?`;
      params = [id, req.user.id];
    } else {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce fichier' });
    }
    
    const [rows] = await pool.execute(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fichier non trouvé ou non autorisé' });
    }
    
    const filePath = rows[0][pathColumn];
    
    // Suppression du fichier dans le stockage
    await storageService.deleteFile(filePath);
    
    // Mise à jour de la base de données
    await pool.execute(
      `UPDATE ${table} SET ${pathColumn} = NULL WHERE ${idColumn} = ?`,
      [id]
    );
    
    res.status(200).json({ message: 'Fichier supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
  }
};