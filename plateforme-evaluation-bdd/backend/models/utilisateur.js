// models/utilisateur.js
module.exports = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('utilisateur', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nom: { type: DataTypes.STRING(100), allowNull: false },
      prenom: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      mot_de_passe_hash: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('PROFESSEUR', 'ETUDIANT'), allowNull: false },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      derniere_connexion: { type: DataTypes.DATE }
    }, {
      indexes: [{ fields: ['email'] }, { fields: ['role'] }]
    });
  
    Utilisateur.associate = models => {
      Utilisateur.hasMany(models.sujet, { foreignKey: 'professeur_id' });
      Utilisateur.hasMany(models.soumission, { foreignKey: 'etudiant_id' });
      Utilisateur.hasMany(models.notification, { foreignKey: 'utilisateur_id' });
      Utilisateur.hasMany(models.log_activite, { foreignKey: 'utilisateur_id' });
    };
  
    return Utilisateur;
  };
  