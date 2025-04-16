// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'professor'], required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}, { timestamps: true });

// Méthode pour mapper avec la structure de la BD MySQL
userSchema.statics.mapFromMySql = function(mysqlUser) {
  return {
    _id: mysqlUser.id,
    firstName: mysqlUser.prenom,
    lastName: mysqlUser.nom,
    email: mysqlUser.email,
    role: mysqlUser.role === 'ETUDIANT' ? 'student' : 'professor',
    createdAt: mysqlUser.date_creation,
    lastLogin: mysqlUser.derniere_connexion
  };
};

const User = mongoose.model('User', userSchema);
module.exports = User;