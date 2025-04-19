const db = require('../models');
const gradeSvc = require('./gradeService');

/**
 * Retourne les chiffres clés pour le Dashboard
 */
async function getOverview() {
  // Nombre d'étudiants
  const studentCount = await db.utilisateur.count({ where: { role: 'ETUDIANT' } });

  // Moyenne générale (note_automatique)
  const [[{ avgNote }]] = await db.sequelize.query(
    `SELECT AVG(note_automatique) AS avgNote
     FROM soumissions
     WHERE note_automatique IS NOT NULL`
  );

  // Nombre de cours actifs (sujets publiés)
  const coursesActive = await db.sujet.count({ where: { etat: 'PUBLIE' } });

  // Pourcentage de mentions Excellent (16-20)
  const dist = await gradeSvc.getGradeDistribution();
  const excellentBucket = dist.find(b => b.category.startsWith('Excellent'));
  const percentExcellent = excellentBucket
    ? Math.round(excellentBucket.percent * 100)
    : 0;

  return {
    studentCount,
    averageScore: parseFloat(avgNote || 0).toFixed(1),
    coursesActive,
    percentExcellent
  };
}

module.exports = { getOverview };