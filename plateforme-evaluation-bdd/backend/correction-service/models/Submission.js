// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  pdfPath: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  aiScore: { type: Number },
  finalScore: { type: Number },
  plagiarismScore: { type: Number },
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  status: { 
    type: String, 
    enum: ['submitted', 'processing', 'corrected', 'reviewed'], 
    default: 'submitted'
  }
}, { timestamps: true });

// Méthode pour mapper avec la structure de la BD MySQL
submissionSchema.statics.mapFromMySql = function(mysqlSubmission) {
  return {
    _id: mysqlSubmission.id,
    student: mysqlSubmission.etudiant_id,
    exercise: mysqlSubmission.sujet_id,
    pdfPath: mysqlSubmission.chemin_fichier_pdf,
    submittedAt: mysqlSubmission.date_soumission,
    aiScore: mysqlSubmission.note_automatique,
    finalScore: mysqlSubmission.note_automatique, // Par défaut même valeur
    status: mysqlSubmission.etat === 'SOUMIS' ? 'submitted' : 
            mysqlSubmission.etat === 'CORRIGE' ? 'corrected' : 'submitted'
  };
};

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;