const db = require('../models');

/**
 * Récupère la répartition des notes automatiques en buckets
 */
async function getGradeDistribution() {
  const [results] = await db.sequelize.query(`
    SELECT
      CASE
        WHEN note_final >= 16 THEN 'Excellent (16-20)'
        WHEN note_final >= 12 THEN 'Bon (12-16)'
        WHEN note_final >= 8  THEN 'Moyen (8-12)'
        ELSE 'Faible (0-8)'
      END as category,
      COUNT(*) as count,
      ROUND(COUNT(*) / (SELECT COUNT(*) FROM soumissions WHERE note_final IS NOT NULL) , 3) as percent
    FROM soumissions
    WHERE note_final IS NOT NULL
    GROUP BY category;
  `);
  return results;
}

module.exports = { getGradeDistribution };