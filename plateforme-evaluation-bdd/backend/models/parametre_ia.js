// models/parametre_ia.js
module.exports = (sequelize, DataTypes) => {
    const ParametreIA = sequelize.define('parametre_ia', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nom: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      valeur: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT },
      date_modification: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  
    return ParametreIA;
  };
  