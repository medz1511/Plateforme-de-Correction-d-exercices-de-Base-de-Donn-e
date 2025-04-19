// services/logActiviteService.js
const db = require('../models');

module.exports = {
  log: (utilisateur_id, action, details, adresse_ip) =>
    db.log_activite.create({ utilisateur_id, action, details, adresse_ip }),
  getAll: () => db.log_activite.findAll()
};
