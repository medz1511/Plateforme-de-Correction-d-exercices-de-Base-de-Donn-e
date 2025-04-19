// models/soumission.js
module.exports = (sequelize, DataTypes) => {
    const Soumission = sequelize.define('soumission', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      chemin_fichier_pdf: { type: DataTypes.STRING(255), allowNull: false },
      date_soumission: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      note_automatique: { type: DataTypes.FLOAT },
      note_final: { type: DataTypes.FLOAT },
      commentaire_ia: { type: DataTypes.TEXT },
      commentaire_prof: { type: DataTypes.TEXT },
      etat_upload: { type: DataTypes.ENUM('EN_COURS', 'TERMINE', 'ERREUR'), defaultValue: 'EN_COURS' },
      etat: { type: DataTypes.ENUM('SOUMIS', 'CORRIGE'), defaultValue: 'SOUMIS' },
      sujet_id: { type: DataTypes.INTEGER, allowNull: false },
      etudiant_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
      indexes: [{ fields: ['sujet_id'] }, { fields: ['etudiant_id'] }, { fields: ['etat'] }]
    });
  
    Soumission.associate = models => {
      Soumission.belongsTo(models.sujet, { foreignKey: 'sujet_id' });
      Soumission.belongsTo(models.utilisateur, { foreignKey: 'etudiant_id' });
    };
  
    return Soumission;
  };
  