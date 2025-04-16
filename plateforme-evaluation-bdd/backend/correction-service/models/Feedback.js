// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  generalComments: { type: String },
  detailedFeedback: [{
    section: { type: String },
    comments: { type: String }
  }],
  strengths: [{ type: String }],
  areasForImprovement: [{ type: String }],
  professorAdjustments: {
    originalScore: { type: Number },
    adjustedScore: { type: Number },
    justification: { type: String },
    adjustedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;