// services/parametreIAService.js
const db = require('../models');

module.exports = {
  getAll: () => db.parametre_ia.findAll(),
  updateParam: (nom, valeur) => db.parametre_ia.update({ valeur }, { where: { nom } })
};
