const { Sequelize } = require("sequelize");
// const sequelize = require('../config/config.json'); // Assure-toi d'avoir la bonne configuration Sequelize
// const sequelize = new Sequelize('data_eval', 'postgres', 'passer', {
//   host: 'localhost',
//   dialect: 'postgres', // Assurez-vous que c'est le bon dialecte
// });

const sequelizeConfig = {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false
};

if (process.env.NODE_ENV === "production") {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeConfig);

module.exports = sequelize;
const User = require("./user")(sequelize, Sequelize.DataTypes);
const Exam = require("./exam")(sequelize, Sequelize.DataTypes);
const Submission = require("./submission")(sequelize, Sequelize.DataTypes);
const Correction = require("./correction")(sequelize, Sequelize.DataTypes);
const Grade = require("./grade")(sequelize, Sequelize.DataTypes);

// Définition des relations
User.hasMany(Exam, { foreignKey: "professorId", as: "exams" });
Exam.belongsTo(User, { foreignKey: "professorId", as: "professor" });

User.hasMany(Submission, { foreignKey: "studentId", as: "submissions" });
Submission.belongsTo(User, { foreignKey: "studentId", as: "student" });

Exam.hasMany(Submission, { foreignKey: "examId", as: "submissions" });
Submission.belongsTo(Exam, { foreignKey: "examId", as: "exam" });

Exam.hasOne(Correction, { foreignKey: "examId", as: "correction" });
Correction.belongsTo(Exam, { foreignKey: "examId", as: "exam" });

Submission.hasOne(Grade, { foreignKey: "submissionId", as: "grade" });
Grade.belongsTo(Submission, { foreignKey: "submissionId", as: "submission" });

User.hasMany(Grade, { foreignKey: "professorId", as: "grades" });
Grade.belongsTo(User, { foreignKey: "professorId", as: "professor" });

module.exports = {
  sequelize,
  User,
  Exam,
  Submission,
  Correction,
  Grade,
};
