// utils/pdfExtractor.js
const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * Extrait le texte d'un fichier PDF
 * @param {string} pdfPath - Chemin vers le fichier PDF
 * @returns {Promise<string>} - Texte extrait
 */
const extractTextFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du texte du PDF:', error);
    throw new Error('Échec de l\'extraction du texte du PDF');
  }
};

/**
 * Compare deux PDFs et calcule un score de similarité
 * @param {string} pdfPath1 - Chemin vers le premier PDF
 * @param {string} pdfPath2 - Chemin vers le deuxième PDF
 * @returns {Promise<number>} - Score de similarité (0-1)
 */
const comparePDFs = async (pdfPath1, pdfPath2) => {
  try {
    const text1 = await extractTextFromPDF(pdfPath1);
    const text2 = await extractTextFromPDF(pdfPath2);
    
    // Calcul simple de similarité basé sur les mots communs
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    
    let commonWords = 0;
    for (const word of words1) {
      if (words2.has(word)) {
        commonWords++;
      }
    }
    
    const totalUniqueWords = new Set([...words1, ...words2]).size;
    return commonWords / totalUniqueWords;
  } catch (error) {
    console.error('Erreur lors de la comparaison des PDFs:', error);
    return 0;
  }
};

module.exports = {
  extractTextFromPDF,
  comparePDFs
};