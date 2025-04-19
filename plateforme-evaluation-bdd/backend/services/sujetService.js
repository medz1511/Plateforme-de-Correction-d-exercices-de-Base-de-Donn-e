// backend/services/sujetService.js
const db = require('../models');
const emailService = require('./emailService'); 

module.exports = {
  /**
   * Récupère tous les sujets publiés par un professeur
   * @param {number} professeurId
   */
  getAll: () => {
      return db.sujet.findAll({
        include: db.utilisateur,
        order: [['date_creation', 'DESC']]
      });
    },

  /**
   * Récupère un sujet par son ID
   * @param {number} id
   */
  getById: id => db.sujet.findByPk(id, {
    include: [{ model: db.utilisateur, as: 'professeur', attributes: ['id','nom','prenom'] }]
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

    // Si le sujet est désormais publié, envoyez un e-mail aux étudiants
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
   * Upload / met à jour le modèle de correction pour un sujet
   * @param {number} id 
   * @param {string} filePath 
   */
  uploadCorrectionModel: async (id, filePath) => {
    await db.sujet.update(
      { chemin_fichier_correction_pdf: filePath },
      { where: { id } }
    );
    return db.sujet.findByPk(id);
  }
};
