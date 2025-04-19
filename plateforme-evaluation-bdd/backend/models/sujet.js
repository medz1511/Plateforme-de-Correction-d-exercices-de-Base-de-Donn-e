// models/sujet.js
module.exports = (sequelize, DataTypes) => {
    const Sujet = sequelize.define('sujet', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      titre: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT },
      chemin_fichier_pdf: { type: DataTypes.STRING(255), allowNull: false },
      chemin_fichier_correction_pdf: { type: DataTypes.STRING(255), allowNull: false },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      date_limite: { type: DataTypes.DATE, allowNull: false },
      etat: { type: DataTypes.ENUM('BROUILLON', 'PUBLIE'), allowNull: false, defaultValue: 'BROUILLON' },
      professeur_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      indexes: [{ fields: ['professeur_id'] }, { fields: ['date_limite'] }, { fields: ['etat'] }]
    });
  
    Sujet.associate = models => {
      Sujet.belongsTo(models.utilisateur, { foreignKey: 'professeur_id' });
      Sujet.hasMany(models.soumission, { foreignKey: 'sujet_id' });
    };
  
    return Sujet;
  };
  