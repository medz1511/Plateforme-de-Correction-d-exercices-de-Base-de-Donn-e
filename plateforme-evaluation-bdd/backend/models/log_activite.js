// models/log_activite.js
module.exports = (sequelize, DataTypes) => {
    const LogActivite = sequelize.define('log_activite', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      utilisateur_id: { type: DataTypes.INTEGER, allowNull: true },
      action: { type: DataTypes.STRING(255), allowNull: false },
      details: { type: DataTypes.TEXT },
      adresse_ip: { type: DataTypes.STRING(45) },
      date_creation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      indexes: [{ fields: ['utilisateur_id'] }, { fields: ['date_creation'] }]
    });
  
    LogActivite.associate = models => {
      LogActivite.belongsTo(models.utilisateur, { foreignKey: 'utilisateur_id' });
    };
  
    return LogActivite;
  };
  