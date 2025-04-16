// config/ollama.js
module.exports = {
    // URL de l'API Ollama
    OLLAMA_API_URL: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    
    // Nom du modèle DeepSeek-Coder à utiliser
    MODEL_NAME: process.env.OLLAMA_MODEL || 'deepseek-coder',
    
    // Paramètres par défaut pour les requêtes
    DEFAULT_PARAMS: {
      temperature: 0.1,      // Valeur basse pour des réponses plus déterministes
      top_p: 0.9,            // Contrôle la diversité des réponses
      max_tokens: 4000,      // Nombre maximum de tokens dans la réponse
      stream: false          // Pas de streaming pour faciliter le traitement
    }
  };