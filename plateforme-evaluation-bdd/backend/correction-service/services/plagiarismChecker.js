// services/plagiarismChecker.js
const { extractTextFromPDF, comparePDFs } = require('../utils/pdfExtractor');
const { pool } = require('../config/database');
const path = require('path');

/**
 * Service de détection de plagiat
 */
class PlagiarismService {
  constructor() {}

  /**
   * Vérifier le plagiat pour une soumission
   * @param {Object} submission - Objet soumission
   * @param {Object} exercise - Objet exercice associé
   * @returns {Promise<number>} - Score de plagiat (0-1)
   */
  async checkPlagiarism(submission, exercise) {
    try {
      // Récupérer toutes les soumissions précédentes pour cet exercice
      const [rows] = await pool.query(
        'SELECT chemin_fichier_pdf FROM soumission WHERE sujet_id = ? AND id != ? LIMIT 20',
        [exercise._id, submission._id]
      );
      
      if (rows.length === 0) {
        return 0; // Pas d'autres soumissions pour comparer
      }
      
      let maxSimilarity = 0;
      
      // Comparer avec chaque soumission précédente
      for (const row of rows) {
        const otherPdfPath = row.chemin_fichier_pdf;
        const similarity = await comparePDFs(submission.pdfPath, otherPdfPath);
        
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
        }
        
        // Si on trouve un score très élevé de similarité, on peut s'arrêter
        if (maxSimilarity > 0.8) {
          break;
        }
      }
      
      return maxSimilarity;
    } catch (error) {
      console.error('Erreur lors de la vérification de plagiat:', error);
      return 0;
    }
  }

  /**
   * Génére un rapport de plagiat
   * @param {Object} submission - Objet soumission
   * @param {number} similarityScore - Score de similarité
   * @returns {Object} - Rapport de plagiat
   */
  generatePlagiarismReport(submission, similarityScore) {
    let riskLevel;
    let recommendation;
    
    if (similarityScore > 0.8) {
      riskLevel = 'Élevé';
      recommendation = 'Vérification manuelle urgente recommandée. Forte suspicion de plagiat.';
    } else if (similarityScore > 0.5) {
      riskLevel = 'Moyen';
      recommendation = 'Vérification recommandée. Similarités importantes détectées.';
    } else if (similarityScore > 0.3) {
      riskLevel = 'Faible';
      recommendation = 'Quelques similarités détectées, probablement normales pour ce type d\'exercice.';
    } else {
      riskLevel = 'Très faible';
      recommendation = 'Aucune similarité significative détectée.';
    }
    
    return {
      submission: submission._id,
      similarityScore: similarityScore,
      riskLevel: riskLevel,
      recommendation: recommendation,
      timestamp: new Date()
    };
  }
}

module.exports = new PlagiarismService();