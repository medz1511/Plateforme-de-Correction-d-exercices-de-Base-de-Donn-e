// models/Exercise.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String },
  pdfPath: { type: String, required: true },
  correctionTemplates: [{
    pdfPath: { type: String },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  published: { type: Boolean, default: false },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Méthode pour mapper avec la structure de la BD MySQL
exerciseSchema.statics.mapFromMySql = function(mysqlExercise) {
  return {
    _id: mysqlExercise.id,
    title: mysqlExercise.titre,
    description: mysqlExercise.description,
    pdfPath: mysqlExercise.chemin_fichier_pdf,
    correctionTemplates: [{
      pdfPath: mysqlExercise.chemin_fichier_correction_pdf,
      createdAt: mysqlExercise.date_creation
    }],
    createdAt: mysqlExercise.date_creation,
    deadline: mysqlExercise.date_limite,
    status: mysqlExercise.etat.toLowerCase(),
    published: mysqlExercise.etat === 'PUBLIE',
    professor: mysqlExercise.professeur_id
  };
};

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;





