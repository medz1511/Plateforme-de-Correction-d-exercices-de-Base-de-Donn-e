'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Exams', 'format', {
      type: Sequelize.ENUM('application/pdf', 'text/plain', 'text/markdown', 'application/x-latex'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Exams', 'format', {
      type: Sequelize.ENUM('text', 'markdown', 'latex', 'pdf'),
      allowNull: false,
    });
  }
};