const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Grade = sequelize.define('Grade', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        feedback: {
            type: DataTypes.TEXT, // Utilisation de TEXT pour permettre des messages longs
            defaultValue: "Erreur d'évaluation. Veuillez contacter un administrateur.", // Valeur par défaut
            allowNull: false,
        },
        is_correct: {
            type: DataTypes.BOOLEAN, // Champ booléen
            defaultValue: false, // Valeur par défaut
            allowNull: false,
        },
        suggestions: {
            type: DataTypes.ARRAY(DataTypes.TEXT), // Tableau de TEXT pour les suggestions
            defaultValue: [], // Valeur par défaut (tableau vide)
            allowNull: false,
        },
    });

    return Grade;
};