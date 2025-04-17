const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Correction = sequelize.define('Correction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    });

    return Correction;
};