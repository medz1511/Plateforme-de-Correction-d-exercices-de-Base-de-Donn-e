const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Exam = sequelize.define('Exam', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        format: {
            type: DataTypes.ENUM('application/pdf', 'text/plain', 'text/markdown', 'application/x-latex'),
            allowNull: false,
        },
        gradingCriteria: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false, // Permettre null si aucun fichier n'est joint
        },
    });

    return Exam;
};