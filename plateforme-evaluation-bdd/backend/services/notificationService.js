// services/notificationService.js
const db = require('../models');

module.exports = {
  getByUser: userId => db.notification.findAll({ where: { utilisateur_id: userId } }),
  markAsRead: id => db.notification.update({ lue: true }, { where: { id } })
};
