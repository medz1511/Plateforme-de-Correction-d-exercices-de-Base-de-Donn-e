// backend/services/sujetService.js
const db = require('../models');
const emailService = require('./emailService');
const fileStorage = require('./fileStorageServices');  // Pour l'upload S3

module.exports = {
  /**
   * Récupère tous les sujets publiés par un professeur
   */
  getAll: () => {
    return db.sujet.findAll({
      include: db.utilisateur,
      order: [['date_creation', 'DESC']]
    });
  },

  /**
   * Récupère un sujet par son ID
   */
  getById: id => db.sujet.findByPk(id, {
    include: [{ model: db.utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }]
  }),

  /**
   * Crée un nouveau sujet
   */
  create: async (data) => {
    const sujet = await db.sujet.create({
      titre: data.titre,
      description: data.description,
      chemin_fichier_pdf: data.referenceFilePath || '',
      chemin_fichier_correction_pdf: '',
      date_limite: data.dateLimite,
      etat: 'PUBLIE',
      professeur_id: data.professeurId
    });
    if (sujet.etat === 'PUBLIE') {
      await emailService.sendEmailToStudents(sujet);
    }
    return sujet;
  },

  /**
   * Met à jour un sujet
   */
  update: async (id, data) => {
    const sujet = await db.sujet.findByPk(id);
    if (!sujet) throw new Error('Sujet non trouvé');

    const updatedSujet = await sujet.update(data);

    if (updatedSujet.etat === 'PUBLIE') {
      await emailService.sendEmailToStudents(updatedSujet);
    }
    return updatedSujet;
  },

  /**
   * Supprime un sujet
   */
  remove: (id) => {
    return db.sujet.destroy({ where: { id } });
  },

  /**
   * Upload / met à jour le modèle de correction pour un sujet (dans models/)
   */
  uploadCorrectionModel: async (sujetId, buffer, originalname, mimetype) => {
    const sujet = await db.sujet.findByPk(sujetId);
    if (!sujet) throw new Error('Sujet non trouvé');

    const filePath = `models/${Date.now()}-${originalname}`;  // Dossier models/
    await fileStorage.uploadFile(buffer, filePath, mimetype);

    await db.sujet.update(
      { chemin_fichier_correction_pdf: filePath },  // Stocke le chemin relatif
      { where: { id: sujetId } }
    );
    return db.sujet.findByPk(sujetId);
  }
};
