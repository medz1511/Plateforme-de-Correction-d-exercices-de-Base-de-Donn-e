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
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (!fs.existsSync(filePath)) throw new Error(`Fichier non trouvé: ${filePath}`);

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const { text } = await pdfParse(dataBuffer);
    return text;
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (['.txt', '.sql', '.json', '.csv'].includes(ext)) {
    return fs.readFileSync(filePath, 'utf-8');
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

  const modelFile  = path.join(__dirname, '../', sujet.chemin_fichier_correction_pdf);
  const sujetFile  = path.join(__dirname, '../', sujet.chemin_fichier_pdf); // 🆕

  let count = 0;

  for (const sub of soumissions) {
    if (!sub.chemin_fichier_pdf) continue;

    const studentFile = path.join(__dirname, '../', sub.chemin_fichier_pdf);

    let score = -1;
    let feedback = "Erreur IA";
    let success = false;

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const result = await runDeepSeek(modelFile, studentFile, sujetFile);
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
async function runDeepSeek(modelFile, submissionFile, sujetFile) {
  const modelText   = await extractTextFromFile(modelFile);
  const studentText = await extractTextFromFile(submissionFile);
  const subjectText = await extractTextFromFile(sujetFile);

  const prompt = [
    '🛑 TU DOIS ABSOLUMENT RÉPONDRE UNIQUEMENT PAR UN OBJET JSON SUR UNE SEULE LIGNE, SANS AUCUN TEXTE NI EXPLICATION AUTOUR.',
    '',
    '🎯 **Contexte de l’examen :**',
    subjectText.trim(),  // 📝 Sujet de l'exercice
    '',
    '✅ **Correction officielle (solution attendue) :**',
    modelText.trim(),    // 📄 Corrigé fourni par le professeur
    '',
    '📝 **Soumission de l’étudiant :**',
    studentText.trim(),  // 👨‍🎓 Soumission étudiante
    '',
    '📊 **Critères d’évaluation à respecter strictement :**',
    `1️⃣ Pertinence technique : La requête répond-elle à la question posée ?`,
    `2️⃣ Exactitude : Le résultat correspond-il à la correction officielle ?`,
    `3️⃣ Syntaxe SQL : La requête est-elle correcte et sans erreurs ?`,
    `4️⃣ Performance : Utilisation efficace des jointures, indexation, etc.`,
    `5️⃣ Clarté : Code lisible, bien structuré et optimisé.`,
    '',
    '📌 **Format JSON STRICT attendu (SUR UNE SEULE LIGNE) :**',
    '{ "score": nombre_entre_0_et_20, "feedback": "commentaire pédagogique en français" }',
    '',
    '🛑 INTERDICTION ABSOLUE D’AJOUTER AUTRE CHOSE QUE CE JSON. PAS DE TEXTE AUTOUR. PAS D’INTRODUCTION. PAS DE NOUVELLE LIGNE.',
    '🛑 SI TU NE PEUX PAS ÉVALUER, RENVOIE EXACTEMENT : {"score": -1, "feedback": "FORMAT JSON NON RESPECTÉ"}'
  ].join('\n');


  console.log('⏺️ [DeepSeek prompt]:', prompt);

  const res = await axios.post(
    OLLAMA_API,
    { model: DEEPSEEK_MODEL, prompt, stream: false },
    { timeout: 15000 } // 15 secondes par exemple
  );
  

  if (!res.data || typeof res.data.response !== 'string') {
    throw new Error('Réponse inattendue de DeepSeek');
  }

  const raw = res.data.response.trim();
  console.log('⏺️ [DeepSeek raw]:', raw);

  // ✅ Étape 1 : JSON sur une seule ligne détecté
  const jsonLine = raw.split('\n').find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
  if (jsonLine) {
    try {
      const obj = JSON.parse(jsonLine);
      if (typeof obj.score === 'number' && typeof obj.feedback === 'string') {
        return obj;
      }
    } catch (e) {
      console.warn('JSON partiellement détecté mais invalide (jsonLine)');
    }
  }

  // ✅ Étape 2 : Analyse ligne par ligne (fallback)
  const lines = raw.split('\n').reverse();
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed.score === 'number' && typeof parsed.feedback === 'string') {
        return parsed;
      }
    } catch (e) {
      console.warn('JSON partiellement détecté mais invalide (reverse)');
    }
  }

  // ✅ Étape 3 : Regex en dernier recours
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
