// backend/services/iaService.js

const db       = require('../models');
const path     = require('path');
const fs       = require('fs');
const pdfParse = require('pdf-parse');
const axios    = require('axios');

const OLLAMA_API     = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL  || 'deepseek6coder:latest';
const MAX_RETRIES    = 3;  // Nombre maximum de tentatives

/** Extrait le texte d'un PDF */
async function extractTextFromPdf(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const { text }   = await pdfParse(dataBuffer);
  return text;
}

/**
 * Pour un sujet donné, corrige et met à jour chaque soumission
 * @returns nombre de copies corrigées
 */
async function correctSubmissionsForSujet(sujetId) {
  const sujet = await db.sujet.findByPk(sujetId);
  if (!sujet) throw new Error(`Sujet ${sujetId} introuvable`);

  if (!sujet.chemin_fichier_correction_pdf) {
    throw new Error(`Aucun modèle de correction pour le sujet ${sujetId}`);
  }

  const soumissions = await db.soumission.findAll({
    where: { sujet_id: sujetId }
  });

  if (soumissions.length === 0) {
    console.log(`Aucune soumission à corriger pour le sujet ${sujetId}`);
    return 0;
  }

  const modelFile = path.join(__dirname, '../', sujet.chemin_fichier_correction_pdf);
  let count = 0;

  for (const sub of soumissions) {
    if (!sub.chemin_fichier_pdf) continue;
    const studentFile = path.join(__dirname, '../', sub.chemin_fichier_pdf);

    try {
      const { score, feedback } = await runDeepSeek(modelFile, studentFile);
      console.log(`→ Soumission ${sub.id} → score=${score}`);

      await sub.update({
        note_final:     score,
        commentaire_ia: feedback,
        etat:           'CORRIGE'
      });
      count++;
    } catch (err) {
      console.error(`Erreur DeepSeek sur soumission ${sub.id}:`, err.message);
      // on continue les autres
    }
  }

  return count;
}

/**
 * Format le prompt pour forcer une réponse JSON avec barème d'évaluation précis
 */
function createJsonPrompt(modelSql, studentSql) {
  return [
    '⚠️⚠️⚠️ TRÈS IMPORTANT ⚠️⚠️⚠️',
    'TA RÉPONSE DOIT ÊTRE UNIQUEMENT UN OBJET JSON SANS TEXTE AVANT OU APRÈS',
    'FORMAT EXACT OBLIGATOIRE: {"score": X, "feedback": "Y"}',
    'X est un nombre entre 0 et 20, Y est un commentaire en français',
    '',
    '=== BARÈME D\'ÉVALUATION ===',
    '- 16-20/20: Excellent travail, équivalent ou très proche de la correction modèle',
    '- 12-15/20: Bon travail avec quelques différences mineures par rapport au modèle',
    '- 8-11/20: Travail correct mais avec des différences significatives',
    '- 4-7/20: Travail incomplet avec des erreurs importantes',
    '- 0-3/20: Travail très insuffisant ou hors sujet',
    '',
    '=== INSTRUCTIONS D\'ÉVALUATION ===',
    '1. Compare la soumission étudiante au corrigé modèle',
    '2. La note doit IMPÉRATIVEMENT être cohérente avec ton feedback',
    '3. Si tu indiques "bon travail" ou "excellent", la note doit être au minimum 14/20',
    '4. Vérifie que la soumission remplit bien les objectifs principaux du modèle',
    '5. Ne pénalise pas les différences syntaxiques mineures (espaces, majuscules, etc.)',
    '',
    '=== CORRIGÉ MODÈLE (SQL) ===',
    modelSql.trim().slice(0, 5000),
    '',
    '=== SOUMISSION ÉTUDIANTE (SQL) ===',
    studentSql.trim().slice(0, 5000),
    '',
    '⚠️ RÉPONDS UNIQUEMENT AVEC UN OBJET JSON VALIDE ⚠️',
    '⚠️ ASSURE-TOI QUE LA NOTE EST COHÉRENTE AVEC LE FEEDBACK ⚠️'
  ].join('\n');
}

/**
 * Essaie d'extraire un JSON valide à partir de la réponse
 */
function parseResponse(raw) {
  // 1) Nettoyage et préparation
  const cleanedResponse = raw.trim()
    // Enlever les backticks de code markdown si présents
    .replace(/^```(json)?\s+|\s+```$/g, '')
    // Enlever tout texte explicatif potentiel avant le premier { ou après le dernier }
    .replace(/^[^{]*/, '')
    .replace(/[^}]*$/, '');

  // 2) Tentative de parsing direct
  try {
    const obj = JSON.parse(cleanedResponse);
    if (typeof obj.score !== 'number' || typeof obj.feedback !== 'string') {
      throw new Error('Champs manquants ou incorrects');
    }
    
    // Vérification de cohérence entre note et feedback
    obj.score = verifyScoreFeedbackConsistency(obj.score, obj.feedback);
    
    return obj;
  } catch (e) {
    console.warn('Parsing JSON échoué après nettoyage:', e.message);
  }

  // 3) Regex avancé pour extraction
  const scoreM = cleanedResponse.match(/"score"\s*:\s*(-?\d+(?:\.\d+)?)/);
  const feedbackM = cleanedResponse.match(/"feedback"\s*:\s*"([^"]+)"/);
  
  if (scoreM && feedbackM) {
    const score = parseFloat(scoreM[1]);
    const feedback = feedbackM[1];
    
    return {
      score: verifyScoreFeedbackConsistency(score, feedback),
      feedback: feedback
    };
  }

  throw new Error(`Impossible de parser la réponse comme JSON valide`);
}

/**
 * Vérifie la cohérence entre la note et le feedback
 * Ajuste la note si nécessaire
 */
function verifyScoreFeedbackConsistency(score, feedback) {
  // Normaliser le score entre 0 et 20
  let adjustedScore = Math.max(0, Math.min(20, score));
  
  // Mots clés positifs qui devraient correspondre à des notes élevées
  const positiveKeywords = [
    'excellent', 'parfait', 'très bon', 'très bien', 'bon travail',
    'bien réalisé', 'bravo', 'félicitations', 'complet', 'correct'
  ];
  
  // Mots clés négatifs qui devraient correspondre à des notes basses
  const negativeKeywords = [
    'insuffisant', 'incomplet', 'incorrect', 'erreurs', 'problèmes',
    'manque', 'difficultés', 'à revoir', 'problématique', 'non conforme'
  ];
  
  const feedbackLower = feedback.toLowerCase();
  
  // Compter les occurrences de mots clés positifs et négatifs
  const positiveCount = positiveKeywords.filter(word => feedbackLower.includes(word)).length;
  const negativeCount = negativeKeywords.filter(word => feedbackLower.includes(word)).length;
  
  // Ajuster la note en fonction des mots clés détectés
  if (positiveCount > 0 && adjustedScore < 14) {
    console.log(`Incohérence détectée: feedback positif (${positiveCount} mots-clés) mais note basse ${adjustedScore}/20`);
    // Ajustement proportionnel à la présence de mots positifs et négatifs
    const baseScore = 14; // Note minimale pour un feedback positif
    const adjustment = positiveCount - (negativeCount * 0.5);
    adjustedScore = Math.max(baseScore, Math.min(20, baseScore + adjustment));
    console.log(`Note ajustée à ${adjustedScore}/20 pour cohérence avec feedback positif`);
  } else if (negativeCount > 0 && adjustedScore > 15) {
    console.log(`Incohérence détectée: feedback négatif (${negativeCount} mots-clés) mais note élevée ${adjustedScore}/20`);
    // Ajustement proportionnel
    const basePenalty = negativeCount * 2;
    adjustedScore = Math.max(0, Math.min(15, adjustedScore - basePenalty));
    console.log(`Note ajustée à ${adjustedScore}/20 pour cohérence avec feedback négatif`);
  }
  
  return Math.round(adjustedScore * 10) / 10; // Arrondi à 1 décimale
}

/**
 * Appel non‑streaming à Ollama avec plusieurs tentatives
 */
async function runDeepSeek(modelFile, submissionFile) {
  const modelSql = await extractTextFromPdf(modelFile);
  const studentSql = await extractTextFromPdf(submissionFile);
  
  let lastError = null;
  let bestResult = null;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Tentative ${attempt}/${MAX_RETRIES} pour DeepSeek...`);
      const prompt = createJsonPrompt(modelSql, studentSql);
      
      console.log('⏺️ [DeepSeek prompt]:', prompt.slice(0, 200) + '…');
      
      const res = await axios.post(
        OLLAMA_API,
        {
          model: DEEPSEEK_MODEL,
          prompt,
          stream: false,
          // Diminuer la température pour plus de consistance
          temperature: 0.1
        }
      );
      
      if (!res.data || typeof res.data.response !== 'string') {
        throw new Error('Réponse inattendue de DeepSeek');
      }
      
      const raw = res.data.response.trim();
      console.log(`⏺️ [DeepSeek raw ${attempt}/${MAX_RETRIES}]:`, raw.slice(0, 200));
      
      // Tenter de parser la réponse
      const result = parseResponse(raw);
      
      // Garder le meilleur résultat (celui avec le feedback le plus détaillé)
      if (!bestResult || result.feedback.length > bestResult.feedback.length) {
        bestResult = result;
      }
      
      // Si le résultat semble cohérent, le retourner immédiatement
      if (attempt > 1 || (result.feedback.length > 50)) {
        return bestResult;
      }
      
    } catch (err) {
      lastError = err;
      console.warn(`Échec tentative ${attempt}/${MAX_RETRIES}:`, err.message);
      // Attendre un peu avant de réessayer
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  // Retourner le meilleur résultat si disponible
  if (bestResult) {
    return bestResult;
  }
  
  // Après toutes les tentatives, renvoyer une évaluation par défaut
  console.error('Toutes les tentatives DeepSeek ont échoué:', lastError?.message);
  return {
    score: 0,
    feedback: `Erreur technique lors de l'évaluation automatique. (${lastError?.message || 'Erreur inconnue'})`
  };
}

module.exports = {
  correctSubmissionsForSujet
};