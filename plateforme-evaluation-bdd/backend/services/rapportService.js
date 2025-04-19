// backend/services/rapportService.js
const db = require('../models');

module.exports = {
  /**
   * Récupère toutes les soumissions (rapports) pour un sujet donné,
   * en incluant les infos de l'étudiant.
   * @param {number|string} sujetId
   */
  getBySujet: (sujetId) => {
    return db.soumission.findAll({
      where: { sujet_id: sujetId },
      include: [
        {
          model: db.utilisateur,
          attributes: ['id', 'nom', 'prenom', 'email'],
        }
      ],
      order: [['date_soumission', 'DESC']]
    });
  }
};
