// utils/validators.js
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Valide une soumission d'exercice
 * @param {Object} submission - Objet de soumission
 * @returns {Object} - Résultat de la validation
 */
const validateSubmission = async (submission) => {
  const result = {
    isValid: true,
    errors: []
  };
  
  // Vérifier que le fichier PDF existe
  if (!submission.pdfPath || !fs.existsSync(submission.pdfPath)) {
    result.isValid = false;
    result.errors.push('Le fichier PDF de soumission est manquant');
    return result;
  }
  
  try {
    // Vérifier que le fichier est un PDF valide
    const pdfBytes = fs.readFileSync(submission.pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Vérifier la taille du PDF (nombre de pages)
    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      result.isValid = false;
      result.errors.push('Le PDF est vide (aucune page)');
    } else if (pageCount > 50) {
      // Exemple: limite à 50 pages
      result.isValid = false;
      result.errors.push(`Le PDF est trop volumineux (${pageCount} pages, maximum 50)`);
    }
    
    // Vérifier la taille du fichier
    const fileSizeInMB = fs.statSync(submission.pdfPath).size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      // Exemple: limite à 10MB
      result.isValid = false;
      result.errors.push(`Le fichier PDF est trop volumineux (${fileSizeInMB.toFixed(2)}MB, maximum 10MB)`);
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Le fichier n'est pas un PDF valide: ${error.message}`);
  }
  
  return result;
};

/**
 * Valide une note donnée par un professeur
 * @param {number} score - Note à valider
 * @returns {Object} - Résultat de la validation
 */
const validateScore = (score) => {
  const result = {
    isValid: true,
    errors: []
  };
  
  // Vérifier que la note est un nombre
  if (typeof score !== 'number' && isNaN(parseFloat(score))) {
    result.isValid = false;
    result.errors.push('La note doit être un nombre');
    return result;
  }
  
  const numericScore = parseFloat(score);
  
  // Vérifier que la note est dans l'intervalle [0, 20]
  if (numericScore < 0 || numericScore > 20) {
    result.isValid = false;
    result.errors.push('La note doit être comprise entre 0 et 20');
  }
  
  return result;
};

module.exports = {
  validateSubmission,
  validateScore
};