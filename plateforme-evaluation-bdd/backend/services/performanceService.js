// backend/services/performanceService.js
const db = require('../models');

/**
 * Récupère les performances par exercice :
 * - aiAvg : moyenne des notes IA
 * - profAvg : provisoirement égal à aiAvg
 * - completion : % d’étudiants ayant rendu un sujet corrigé
 */
async function getExercisePerformance() {
  // Total d’étudiants
  const totalStudents = await db.utilisateur.count({ where: { role: 'ETUDIANT' } });

  // Agrégation par sujet
  const [results] = await db.sequelize.query(`
    SELECT
      s.id                    AS exerciceId,
      s.titre                 AS name,
      COALESCE(ROUND(AVG(so.note_automatique),1), 0) AS aiAvg,
      COALESCE(ROUND(AVG(so.note_automatique),1), 0) AS profAvg,
      COALESCE(ROUND( COUNT(so.id) * 100.0 / :totalStudents , 0), 0) AS completion,
      0 AS timeAvg  -- placeholder, à remplacer si vous avez un champ timeAvg
    FROM sujets s
    LEFT JOIN soumissions so
      ON so.sujet_id = s.id
      AND so.etat = 'CORRIGE'
    GROUP BY s.id, s.titre
    ORDER BY s.titre
  `, {
    replacements: { totalStudents },
    type: db.Sequelize.QueryTypes.SELECT
  });

  return results;
}

module.exports = { getExercisePerformance };
