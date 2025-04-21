// backend/services/iaService.js

const db       = require('../models');
const path     = require('path');
const fs       = require('fs');
const pdfParse = require('pdf-parse');
const axios    = require('axios');

const OLLAMA_API     = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL  || 'deepseek6coder:latest';

/** Extrait le texte d’un PDF */
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
 * Appel non‑streaming à Ollama + parsing JSON strict
 */
async function runDeepSeek(modelFile, submissionFile) {
  const modelSql   = await extractTextFromPdf(modelFile);
  const studentSql = await extractTextFromPdf(submissionFile);

  const prompt = [
    '🛑 TU DOIS RÉPONDRE EXCLUSIVEMENT PAR UN OBJET JSON BRUT, SANS RIEN D’AUTRE ⬇️',
    '{ "score": nombre_entre_0_et_20, "feedback": "commentaire en français" }',
    '',
    '=== CORRIGÉ MODÈLE (SQL) ===',
    modelSql.trim().slice(0, 5000),
    '',
    '=== SOUMISSION ÉTUDIANTE (SQL) ===',
    studentSql.trim().slice(0, 5000),
    '',
    '🛑 SI TU NE PEUX PAS, RÉPONDS { "score": -1, "feedback": "FORMAT JSON NON RESPECTÉ" }'
  ].join('\n');

  console.log('⏺️ [DeepSeek prompt]:', prompt.slice(0,200) + '…');

  // on désactive le stream pour obtenir tout d’un coup
  const res = await axios.post(
    OLLAMA_API,
    {
      model: DEEPSEEK_MODEL,
      prompt,
      stream: false
    }
  );

  if (!res.data || typeof res.data.response !== 'string') {
    throw new Error('Réponse inattendue de DeepSeek');
  }

  const raw = res.data.response.trim();
  console.log('⏺️ [DeepSeek raw]:', raw);

  // 1) Tentative JSON.parse directe
  try {
    const obj = JSON.parse(raw);
    if (typeof obj.score !== 'number' || typeof obj.feedback !== 'string') {
      throw new Error('Champs manquants');
    }
    return obj;
  } catch (e) {
    console.warn('Parsing direct échoué :', e.message);
  }

  // 2) Fallback regex
  const scoreM    = raw.match(/"score"\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)/);
  const feedbackM = raw.match(/"feedback"\s*:\s*"([^"]*)"/);
  if (scoreM && feedbackM) {
    return {
      score:    parseFloat(scoreM[1]),
      feedback: feedbackM[1]
    };
  }

  throw new Error(`Impossible de parser le JSON final :\n${raw}`);
}

module.exports = {
  correctSubmissionsForSujet
};
