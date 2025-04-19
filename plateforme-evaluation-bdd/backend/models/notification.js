// models/notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titre: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    lue: { type: DataTypes.BOOLEAN, defaultValue: false },
    date_creation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    type: { type: DataTypes.ENUM('NOUVEAU_SUJET','NOTE_DISPONIBLE','RAPPEL_ECHEANCE'), allowNull: false },
    utilisateur_id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    indexes: [{ fields: ['utilisateur_id'] }, { fields: ['lue'] }]
  });

  Notification.associate = models => {
    Notification.belongsTo(models.utilisateur, { foreignKey: 'utilisateur_id' });
  };

  return Notification;
};