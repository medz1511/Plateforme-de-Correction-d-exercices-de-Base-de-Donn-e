const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Submission = sequelize.define('Submission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT, // Changé de STRING à TEXT
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('assigned', 'correction', 'graded'), // Enum avec les valeurs spécifiées
            defaultValue: 'assigned', // Valeur par défaut
            allowNull: false,
        },
    });

    return Submission;
};