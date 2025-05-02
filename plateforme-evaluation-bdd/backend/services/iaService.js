const db       = require('../models');
const path     = require('path');
const fs       = require('fs');
const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');
const axios    = require('axios');

const OLLAMA_API     = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/api/generate';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL  || 'deepseek6coder:latest';

/** 
 * Extraction de texte selon le type de fichier 
 */
const fileStorage = require('./fileStorageServices'); // ton service S3

async function extractTextFromFile(fileKey) {
  const ext = path.extname(fileKey).toLowerCase();
  const buffer = await fileStorage.downloadFileBuffer(fileKey);

  if (ext === '.pdf') {
    const { text } = await pdfParse(buffer);
    return text;
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (['.txt', '.sql', '.json', '.csv'].includes(ext)) {
    return buffer.toString('utf-8');
  }

  throw new Error(`Type de fichier non pris en charge: ${ext}`);
}


/**
 * Corrige les soumissions pour un sujet donné
 */
async function correctSubmissionsForSujet(sujetId) {
  const sujet = await db.sujet.findByPk(sujetId);
  if (!sujet) throw new Error(`Sujet ${sujetId} introuvable`);
  if (!sujet.chemin_fichier_correction_pdf) throw new Error(`Aucun corrigé disponible pour le sujet ${sujetId}`);

  const soumissions = await db.soumission.findAll({ where: { sujet_id: sujetId } });
  if (soumissions.length === 0) return 0;

const modelFileKey = sujet.chemin_fichier_correction_pdf;
const sujetFileKey = sujet.chemin_fichier_pdf;



  let count = 0;

  for (const sub of soumissions) {
    if (!sub.chemin_fichier_pdf) continue;

    const studentFileKey = sub.chemin_fichier_pdf;

    let score = -1;
    let feedback = "Erreur IA";
    let success = false;

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const result = await runDeepSeek(modelFileKey, studentFileKey, sujetFileKey);
        score = result.score;
        feedback = result.feedback;
        success = true;
        break;
      } catch (err) {
        console.error(`Tentative ${attempt} échouée pour soumission ${sub.id}:`, err.message);
        if (attempt === 2) {
          console.error(`❌ Correction abandonnée après 2 tentatives pour soumission ${sub.id}`);
        } else {
          console.log(`↻ Nouvelle tentative pour soumission ${sub.id}...`);
        }
      }
    }

    if (success) {
      await sub.update({
        note_automatique: score,
        commentaire_ia: feedback,
        etat: 'CORRIGE'
      });
      count++;
    }
  }

  return count;
}

/**
 * Appelle DeepSeek via Ollama pour évaluer une soumission
 */
async function runDeepSeek(modelKey, submissionKey, sujetKey) {
  const modelText = await extractTextFromFile(modelKey);
  const studentText = await extractTextFromFile(submissionKey);
  const subjectText = await extractTextFromFile(sujetKey);

  const prompt = [
    "RÉPONDS UNIQUEMENT AVEC CE FORMAT EXACT : {\"score\": nombre_entre_0_et_20, \"feedback\": \"commentaire court\"}",
    "NE RAJOUTE RIEN D'AUTRE.",
    "PAS DE COMMENTAIRE, PAS DE TEXTE, PAS DE TITRE, PAS DE RETOUR À LA LIGNE.",
    "",
    "Sujet :",
    subjectText.trim(),
    "",
    "Correction attendue :",
    modelText.trim(),
    "",
    "Soumission étudiante :",
    studentText.trim(),
    "",
    "Critères : pertinence, exactitude, syntaxe SQL, performance, clarté.",
    "",
    "⚠️ SI TU SORS DU FORMAT DEMANDÉ, TU ÉCHOUES LA TÂCHE. TU DOIS RÉPONDRE EXACTEMENT COMME CECI :",
    "{\"score\": 14, \"feedback\": \"Bonne structure mais erreurs de syntaxe.\"}",
    "",
    "Si tu ne peux pas répondre, écris exactement : {\"score\": -1, \"feedback\": \"FORMAT JSON NON RESPECTÉ\"}"
  ].join('\n');

  console.log('⏺️ [DeepSeek prompt]:', prompt);

  const res = await axios.post(
    OLLAMA_API,
    { model: DEEPSEEK_MODEL, prompt, stream: false, stop: ['\n'] },
    { timeout: 35000 }
  );

  if (!res.data || typeof res.data.response !== 'string') {
    throw new Error('Réponse inattendue de DeepSeek');
  }

  const raw = res.data.response.trim();
  console.log('⏺️ [DeepSeek raw]:', raw);

  // Étape 1 : JSON ligne unique avec nettoyage
  const jsonLine = raw.split('\n').find(line => line.trim().startsWith('{') && line.trim().includes('feedback'));
  if (jsonLine) {
    try {
      const cleaned = jsonLine.split('//')[0].trim();
      const obj = JSON.parse(cleaned);
      if (typeof obj.score === 'number' && typeof obj.feedback === 'string') {
        return obj;
      }
    } catch (err) {
      console.warn('⚠️ JSON détecté mais invalide après nettoyage');
    }
  }

  // Étape 2 : fallback ligne par ligne
  const lines = raw.split('\n').reverse();
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed.score === 'number' && typeof parsed.feedback === 'string') {
        return parsed;
      }
    } catch (e) {}
  }

  // Étape 3 : regex
  const scoreM = raw.match(/"score"\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)/);
  const feedbackM = raw.match(/"feedback"\s*:\s*"([^"]*)"/);
  if (scoreM && feedbackM) {
    return {
      score: parseFloat(scoreM[1]),
      feedback: feedbackM[1]
    };
  }

  throw new Error(`Impossible de parser le JSON final :\n${raw}`);
}


module.exports = {
  correctSubmissionsForSujet
};
