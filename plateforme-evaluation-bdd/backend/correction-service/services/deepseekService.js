// services/deepseekService.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { OLLAMA_API_URL, MODEL_NAME } = require('../config/ollama');

/**
 * Service pour interagir avec Ollama et DeepSeek pour la correction automatique
 */
class DeepSeekService {
  constructor() {
    this.apiUrl = OLLAMA_API_URL;
    this.model = MODEL_NAME;
  }

  /**
   * Extrait le texte d'un fichier PDF
   * @param {string} pdfPath - Chemin vers le fichier PDF
   * @returns {Promise<string>} - Texte extrait du PDF
   */
  async extractTextFromPDF(pdfPath) {
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte du PDF:', error);
      throw new Error('Impossible d\'extraire le texte du PDF');
    }
  }

  /**
   * Prépare le prompt pour l'IA avec les informations nécessaires
   * @param {string} exerciseText - Texte de l'exercice
   * @param {string} correctionText - Texte du modèle de correction
   * @param {string} submissionText - Texte de la soumission à corriger
   * @returns {string} - Prompt formaté pour l'IA
   */
  preparePrompt(exerciseText, correctionText, submissionText) {
    return `
      Tu es un assistant spécialisé dans la correction automatique d'exercices de bases de données.
      
      # Exercice
      ${exerciseText}
      
      # Modèle de correction
      ${correctionText}
      
      # Réponse de l'étudiant
      ${submissionText}
      
      Évalue la réponse de l'étudiant en comparant avec le modèle de correction.
      
      Ton analyse doit inclure:
      1. Une note sur 20 basée sur la qualité et l'exactitude de la réponse
      2. Un feedback détaillé pour chaque partie de l'exercice
      3. Les points forts de la réponse
      4. Les points d'amélioration avec des suggestions concrètes
      5. Une justification de la note attribuée
      
      Attention à ne pas pénaliser les solutions correctes mais différentes du modèle de correction.
      Réponds au format JSON avec les clés suivantes: score, generalFeedback, detailedFeedback, strengths, improvements, justification.
    `;
  }

  /**
   * Envoie une requête à Ollama avec DeepSeek pour obtenir une correction
   * @param {string} prompt - Prompt préparé pour l'IA
   * @returns {Promise<Object>} - Réponse formatée de l'IA
   */
  async queryOllama(prompt) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          max_tokens: 4000
        }
      });

      // Extraction de la réponse JSON
      const textResponse = response.data.response;
      let jsonResponse;
      
      try {
        // Extraction du JSON si la réponse est entourée de backticks
        const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                         textResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                         textResponse.match(/{[\s\S]*?}/);
                         
        if (jsonMatch) {
          jsonResponse = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          // Tenter de parser toute la réponse comme JSON
          jsonResponse = JSON.parse(textResponse);
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing de la réponse JSON:', parseError);
        
        // Fallback: créer un objet structuré à partir de la réponse texte
        jsonResponse = {
          score: this.extractScore(textResponse),
          generalFeedback: textResponse,
          detailedFeedback: [],
          strengths: [],
          improvements: [],
          justification: "La réponse n'a pas pu être correctement structurée."
        };
      }
      
      return jsonResponse;
    } catch (error) {
      console.error('Erreur lors de la requête à Ollama:', error);
      if (error.response) {
        console.error('Réponse d\'erreur:', error.response.data);
        console.error('Status:', error.response.status);
      }
    
      throw new Error("Impossible de communiquer avec le service d'IA");
    }
  }
  
  /**
   * Tente d'extraire un score d'une réponse texte
   * @param {string} text - Texte de la réponse
   * @returns {number} - Score extrait ou valeur par défaut
   */
  extractScore(text) {
    const scoreMatch = text.match(/\b(note|score)\s*:?\s*(\d+(\.\d+)?)\s*\/\s*20\b/i);
    if (scoreMatch && scoreMatch[2]) {
      return parseFloat(scoreMatch[2]);
    }
    return 10; // Score par défaut si aucun score n'est trouvé
  }

  /**
   * Procède à la correction complète d'une soumission
   * @param {Object} exercise - Objet exercice
   * @param {Object} submission - Objet soumission
   * @returns {Promise<Object>} - Résultat de la correction
   */
  async correctSubmission(exercise, submission) {
    try {
      // Extraction du texte des PDFs
      const exerciseText = await this.extractTextFromPDF(exercise.pdfPath);
      const submissionText = await this.extractTextFromPDF(submission.pdfPath);
      
      // Utilisation du premier modèle de correction disponible
      const correctionTemplate = exercise.correctionTemplates[0];
      let correctionText;
      
      if (correctionTemplate.pdfPath) {
        correctionText = await this.extractTextFromPDF(correctionTemplate.pdfPath);
      } else {
        correctionText = correctionTemplate.content;
      }
      
      // Préparation du prompt et envoi à l'IA
      const prompt = this.preparePrompt(exerciseText, correctionText, submissionText);
      const aiResponse = await this.queryOllama(prompt);
      
      return {
        submissionId: submission._id,
        exerciseId: exercise._id,
        score: aiResponse.score,
        feedback: {
          generalComments: aiResponse.generalFeedback,
          detailedFeedback: Array.isArray(aiResponse.detailedFeedback) 
            ? aiResponse.detailedFeedback 
            : [{section: "Général", comments: aiResponse.detailedFeedback}],
          strengths: Array.isArray(aiResponse.strengths) 
            ? aiResponse.strengths 
            : [aiResponse.strengths],
          areasForImprovement: Array.isArray(aiResponse.improvements) 
            ? aiResponse.improvements 
            : [aiResponse.improvements]
        }
      };
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
      throw new Error('Échec de la correction automatique');
    }
  }
}

module.exports = new DeepSeekService();