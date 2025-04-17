const bcrypt = require('bcryptjs');
const { User, Exam } = require('../models');

module.exports = async function seed() {
  try {
    // Créer un administrateur
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      prenom: 'Admin',
      nom: 'System',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });
    
    // Créer un professeur
    const profPassword = await bcrypt.hash('prof123', 10);
    const prof = await User.create({
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'prof@example.com',
      password: profPassword,
      role: 'professeur',
      status: 'active'
    });
    
    // Créer un étudiant
    const etudiantPassword = await bcrypt.hash('etudiant123', 10);
    const etudiant = await User.create({
      prenom: 'Marie',
      nom: 'Martin',
      email: 'etudiant@example.com',
      password: etudiantPassword,
      role: 'etudiant',
      status: 'active'
    });
    
    // Créer un examen de test
    const exam = await Exam.create({
      title: 'Introduction à SQL',
      description: 'Exercices de base de données relationnelles',
      instructions: 'Répondez à toutes les questions en utilisant PostgreSQL',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Date limite: 1 semaine
      status: 'published',
      professorId: prof.id
    });
    
    console.log('Données de test créées avec succès!');
    return { admin, prof, etudiant, exam };
  } catch (error) {
    console.error('Erreur lors de la création des données de test:', error);
    throw error;
  }
};