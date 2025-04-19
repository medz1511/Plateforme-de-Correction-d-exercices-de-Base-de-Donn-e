// services/utilisateurService.js
const db = require('../models');

module.exports = {
  getAll: () => db.utilisateur.findAll(),
  getById: id => db.utilisateur.findByPk(id),
  create: data => db.utilisateur.create(data),
  update: (id, data) => db.utilisateur.update(data, { where: { id } }),
  remove: id => db.utilisateur.destroy({ where: { id } })
};
