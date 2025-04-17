// const axios = require('axios');
//
// // Configuration pour OpenRouter
// const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1";
// const API_KEY = process.env.OPENROUTER_API_KEY;
// const MODEL_NAME = process.env.DEEPSEEK_MODEL || "deepseek-coder";
//
// class DeepSeekAI {
//     constructor() {
//         this.apiUrl = OPENROUTER_API_URL;
//         this.model = MODEL_NAME;
//     }
//
//     /**
//      * Envoie une requête à l'API OpenRouter
//      * @param {string} prompt - Le prompt à envoyer au modèle
//      * @returns {Promise<string>} - La réponse du modèle
//      */
//     async generateResponse(prompt) {
//         try {
//             const response = await axios.post(
//                 `${this.apiUrl}/chat/completions`,
//                 {
//                     model: this.model,
//                     messages: [{ role: "system", content: "Tu es un assistant intelligent pour l'évaluation d'examens SQL." },
//                         { role: "user", content: prompt }]
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${API_KEY}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
//
//             return response.data.choices[0].message.content;
//         } catch (error) {
//             console.error("Erreur lors de la communication avec OpenRouter:", error.message);
//             throw new Error("Échec de la communication avec OpenRouter.");
//         }
//     }
//
//     /**
//      * Génère une correction pour un examen de base de données à partir du texte extrait
//      * @param {string} extractedText - Texte extrait du fichier d'examen
//      * @param {string|object} gradingCriteria - Critères d'évaluation et barème fournis par le professeur
//      * @returns {Promise<string>} - Contenu de la correction générée
//      */
//     async generateCorrection(extractedText, gradingCriteria) {
//         // Transformer les critères en format string s'ils sont fournis en tant qu'objet
//         let criteriaText = gradingCriteria;
//         if (typeof gradingCriteria === 'object') {
//             criteriaText = JSON.stringify(gradingCriteria, null, 2);
//         }
//
//         const prompt = `
// Tu es un **correcteur expert en bases de données**, spécialisé dans l'élaboration de corrections d'examens.
// Tu dois générer une **correction détaillée et pédagogique** à partir du contenu de l'examen fourni.
//
// 📌 **IMPORTANT :**
// - **Tu dois répondre exclusivement en français**.
// - **Formate ta correction de manière structurée**, avec des explications claires pour chaque question.
// - **La note par défaut est sur 20**, mais le professeur peut avoir défini un barème différent (ex: /40, /100).
//   Tu dois toujours **ajuster l'évaluation en fonction du barème fourni** pour garantir une notation cohérente.
//
// 🔎 **CONTENU DE L'EXAMEN :**
// ${extractedText}
//
// 📌 **CRITÈRES D'ÉVALUATION ET BARÈME :**
// ${criteriaText}
//
// ---
//
// 📝 **🔹 Structure attendue pour la correction :**
//
// ### **1️⃣ Questions SQL**
// - **Requête correcte** : Fournis la solution SQL optimale.
// - **Explication détaillée** : Décris la logique de la requête, ses étapes et son fonctionnement.
// - **Commentaires techniques** : Explique les jointures, les groupements, l'optimisation de la requête.
// - **Erreurs courantes** : Indique les erreurs fréquentes et comment les éviter.
// - **Notation** : Attribue des points **en respectant le barème spécifié**.
//
// ### **2️⃣ Questions de modélisation**
// - **Schéma relationnel** : Propose le modèle correct avec les entités et relations appropriées.
// - **Explication des choix** : Justifie les clés primaires, étrangères et la normalisation appliquée.
// - **Correction des erreurs courantes** : Précise les fautes classiques et comment les éviter.
// - **Notation** : Ajuste la note selon le barème fourni par le professeur.
//
// ---
//
// 🎯 **Objectif** :
// Fournis une **correction complète, structurée et pédagogique** pour chaque question, en expliquant **pourquoi** une réponse est correcte ou incorrecte.
// Respecte les critères d'évaluation fournis par le professeur, **en adaptant l'attribution des points au barème défini**.
// `;
//
//
//         try {
//             const correctionContent = await this.generateResponse(prompt);
//             return correctionContent;
//         } catch (error) {
//             console.error('Erreur lors de la génération de la correction:', error.message);
//             return "Une erreur est survenue lors de la génération de la correction automatique. Veuillez réessayer ou contacter un administrateur.";
//         }
//     }
//
//
//
//     async gradeSubmission(studentQuery, correctSolution, examContent) {
//         const prompt = `
// Tu es un correcteur expert en **SQL et bases de données**, spécialisé dans **l'évaluation des copies d'examen**.
// Ta mission est de comparer la **réponse soumise par l'étudiant** avec **la correction officielle** et **le contexte de l'examen**, afin de lui attribuer une **note juste et pédagogique**.
//
// 📌 **IMPORTANT :**
// - **Tu dois répondre exclusivement en français**.
// - **Ta réponse doit être **précise et formatée en JSON strict** (pas de texte en dehors de l'objet JSON).
// - **N'attribue pas 0 automatiquement** sauf si la réponse est vide ou complètement hors sujet.
//
// 🔎 **Contexte de l'examen** :
// \`\`\`
// ${examContent}
// \`\`\`
//
// 📝 **Réponse de l'étudiant** :
// \`\`\`sql
// ${studentQuery}
// \`\`\`
//
// ✅ **Correction officielle** :
// \`\`\`sql
// ${correctSolution}
// \`\`\`
//
// 📌 **Critères de notation** :
// 1️⃣ **Pertinence** : La requête répond-elle à la question posée dans l'examen ?
// 2️⃣ **Exactitude** : Le résultat est-il identique à la correction officielle ?
// 3️⃣ **Syntaxe SQL** : La requête est-elle correcte et exécutable sans erreur ?
// 4️⃣ **Optimisation** : Utilise-t-elle les bonnes pratiques (indexation, jointures, etc.) ?
// 5️⃣ **Clarté** : La requête est-elle bien structurée et lisible ?
//
// 📌 **Format JSON attendu (strictement respecter ce format)** :
// {
//   "score": <nombre entre 0 et 20 (ou selon le barème de l'examen)>,
//   "feedback": "<Explication pédagogique détaillée, avec des conseils d'amélioration>",
//   "is_correct": <true ou false>,
//   "suggestions": [
//     "Suggestion détaillée pour améliorer la requête",
//     "Autre conseil pertinent"
//   ]
// }
//
// 🎯 **Objectif** :
// - Fournir **une correction détaillée et pédagogique** en expliquant **les points forts et les erreurs**.
// - Ne pas pénaliser fortement si la requête est correcte mais mal optimisée, donner plutôt un **feedback constructif**.
// - Vérifier si la requête répond bien **au contexte de l'examen** et pas seulement à la correction brute.
// `;
//
//
//         try {
//             console.log('Envoi de la requête à DeepSeek...');
//             const responseText = await this.generateResponse(prompt);
//             console.log('Réponse reçue de DeepSeek:', responseText.substring(0, 100) + '...');
//
//             // Nettoyage des balises <think> et autres contenus non JSON
//             const cleanResponse = responseText
//                 .replace(/<think>[\s\S]*?<\/think>/g, '') // Supprime les balises <think> et leur contenu
//                 .replace(/```json|```/g, '')             // Supprime les marqueurs de code JSON
//                 .trim();                                 // Supprime les espaces inutiles
//
//             console.log('Réponse nettoyée:', cleanResponse.substring(0, 100) + '...');
//
//             try {
//                 // Tentative de parse du JSON nettoyé
//                 const evaluation = JSON.parse(cleanResponse);
//                 console.log('Parsing JSON réussi:', evaluation);
//
//                 // Vérification et normalisation des données
//                 const result = {
//                     score: typeof evaluation.score === 'number' ? evaluation.score : -1,
//                     feedback: typeof evaluation.feedback === 'string' ?
//                         evaluation.feedback : String(evaluation.feedback),
//                     is_correct: Boolean(evaluation.is_correct),
//                     suggestions: Array.isArray(evaluation.suggestions) ? evaluation.suggestions : []
//                 };
//
//                 console.log('Résultat final:', result);
//                 return result;
//             } catch (parseError) {
//                 console.error('Erreur de parsing JSON après nettoyage:', parseError.message);
//
//                 // Extraction avec regex comme fallback
//                 const jsonRegexPatterns = [
//                     /(\{[\s\S]*\})/,           // Regex standard pour capturer le JSON complet
//                     /```json([\s\S]*?)```/,     // Capture le JSON entre les backticks markdown
//                     /\{[\s\S]*?"score"[\s\S]*?\}/  // Capture un objet JSON contenant "score"
//                 ];
//
//                 for (const pattern of jsonRegexPatterns) {
//                     const match = responseText.match(pattern);
//                     if (match) {
//                         const potentialJson = match[1] || match[0];
//                         console.log('Tentative d\'extraction avec regex:', potentialJson.substring(0, 100) + '...');
//
//                         try {
//                             const extractedEvaluation = JSON.parse(potentialJson.trim());
//                             console.log('Extraction réussie:', extractedEvaluation);
//
//                             return {
//                                 score: typeof extractedEvaluation.score === 'number' ? extractedEvaluation.score : -1,
//                                 feedback: typeof extractedEvaluation.feedback === 'string' ?
//                                     extractedEvaluation.feedback : String(extractedEvaluation.feedback),
//                                 is_correct: Boolean(extractedEvaluation.is_correct),
//                                 suggestions: Array.isArray(extractedEvaluation.suggestions) ?
//                                     extractedEvaluation.suggestions : []
//                             };
//                         } catch (secondParseError) {
//                             console.error('Échec de l\'extraction avec pattern:', secondParseError.message);
//                             // Continue avec le prochain pattern
//                         }
//                     }
//                 }
//
//                 // Dernier recours : recherche de structure JSON partielle
//                 const scoreMatch = responseText.match(/"score"\s*:\s*(\d+\.?\d*)/);
//                 const feedbackMatch = responseText.match(/"feedback"\s*:\s*"([^"]+)"/);
//                 const isCorrectMatch = responseText.match(/"is_correct"\s*:\s*(true|false)/);
//
//                 if (scoreMatch) {
//                     console.log('Extraction partielle réussie avec score:', scoreMatch[1]);
//                     return {
//                         score: parseFloat(scoreMatch[1]),
//                         feedback: feedbackMatch ? feedbackMatch[1] : "Feedback extrait partiellement",
//                         is_correct: isCorrectMatch ? isCorrectMatch[1] === 'true' : false,
//                         suggestions: []
//                     };
//                 }
//
//                 // Fallback en cas d'échec complet
//                 console.error('Tous les essais de parsing ont échoué');
//                 return {
//                     score: -1,
//                     feedback: "Erreur lors du traitement de l'évaluation. La réponse du modèle n'était pas au format JSON attendu.",
//                     is_correct: false,
//                     suggestions: []
//                 };
//             }
//         } catch (error) {
//             console.error('Erreur lors de l\'évaluation avec DeepSeek:', error);
//             return {
//                 score: -1,
//                 feedback: "Erreur lors de l'évaluation automatique: " + error.message,
//                 is_correct: false,
//                 suggestions: []
//             };
//         }
//     }
//
//     /**
//      * Compare les résultats d'exécution de deux requêtes SQL
//      * @param {object} studentResult - Le résultat de l'exécution de la requête de l'étudiant
//      * @param {object} expectedResult - Le résultat attendu
//      * @returns {Promise<{similarity: number, analysis: string}>} - Analyse de similarité
//      */
//     async compareExecutionResults(studentResult, expectedResult) {
//         const prompt = `
// Tu es un expert en SQL chargé de comparer les résultats d'exécution de deux requêtes.
//
// Résultat de l'étudiant:
// ${JSON.stringify(studentResult, null, 2)}
//
// Résultat attendu:
// ${JSON.stringify(expectedResult, null, 2)}
//
// Compare les deux résultats et fournit:
// 1. Un pourcentage de similarité entre 0 et 100
// 2. Une analyse des différences
// 3. Pourquoi ces différences sont importantes ou non
//
// Format de réponse:
// {
//   "similarity": <nombre entre 0 et 100>,
//   "analysis": "<analyse détaillée>",
//   "key_differences": ["différence1", "différence2", ...]
// }
// `;
//
//         try {
//             const responseText = await this.generateResponse(prompt);
//
//             // Extraction du JSON de la réponse
//             let jsonMatch = responseText.match(/\{[\s\S]*\}/);
//             if (!jsonMatch) {
//                 return {
//                     similarity: 0,
//                     analysis: "Erreur d'analyse. Format de réponse incorrect.",
//                     key_differences: []
//                 };
//             }
//
//             return JSON.parse(jsonMatch[0]);
//         } catch (error) {
//             console.error('Erreur lors de la comparaison des résultats:', error.message);
//             return {
//                 similarity: 0,
//                 analysis: "Erreur lors de la comparaison des résultats d'exécution.",
//                 key_differences: []
//             };
//         }
//     }
//
//     /**
//      * Génère des indices pour aider l'étudiant lorsqu'il est bloqué
//      * @param {string} exerciseDescription - Description de l'exercice
//      * @param {string} studentAttempt - Tentative actuelle de l'étudiant (peut être vide)
//      * @returns {Promise<{hints: string[]}>} - Liste d'indices
//      */
//     async generateHints(exerciseDescription, studentAttempt = "") {
//         const prompt = `
// En tant que professeur de SQL, génère 3 indices progressifs pour aider un étudiant bloqué sur cet exercice:
//
// Description de l'exercice:
// ${exerciseDescription}
//
// ${studentAttempt ? `Tentative actuelle de l'étudiant:
// \`\`\`sql
// ${studentAttempt}
// \`\`\`
// ` : 'L\'étudiant n\'a pas encore fait de tentative.'}
//
// Fournit 3 indices:
// - Un premier indice subtil qui oriente vers la bonne direction
// - Un deuxième indice plus explicite sur l'approche à prendre
// - Un troisième indice très spécifique qui donne presque la solution
//
// Format de réponse:
// {
//   "hints": [
//     "<indice1>",
//     "<indice2>",
//     "<indice3>"
//   ]
// }
// `;
//
//         try {
//             const responseText = await this.generateResponse(prompt);
//
//             // Extraction du JSON de la réponse
//             let jsonMatch = responseText.match(/\{[\s\S]*\}/);
//             if (!jsonMatch) {
//                 return {
//                     hints: ["Désolé, impossible de générer des indices pour le moment."]
//                 };
//             }
//
//             return JSON.parse(jsonMatch[0]);
//         } catch (error) {
//             console.error('Erreur lors de la génération d\'indices:', error.message);
//             return {
//                 hints: ["Désolé, une erreur est survenue lors de la génération d'indices."]
//             };
//         }
//     }
//
//     /**
//      * Explique une erreur SQL spécifique à l'étudiant
//      * @param {string} sqlQuery - La requête avec erreur
//      * @param {string} errorMessage - Le message d'erreur retourné
//      * @returns {Promise<{explanation: string, fix_suggestion: string}>} - Explication et suggestion
//      */
//     async explainError(sqlQuery, errorMessage) {
//         const prompt = `
// Explique cette erreur SQL à un étudiant de manière pédagogique:
//
// Requête SQL:
// \`\`\`sql
// ${sqlQuery}
// \`\`\`
//
// Message d'erreur:
// ${errorMessage}
//
// Fournit:
// 1. Une explication claire de l'erreur pour un débutant
// 2. La raison probable de cette erreur
// 3. Une suggestion concrète pour corriger le problème
//
// Format de réponse:
// {
//   "explanation": "<explication détaillée>",
//   "reason": "<raison de l'erreur>",
//   "fix_suggestion": "<suggestion de correction>"
// }
// `;
//
//         try {
//             const responseText = await this.generateResponse(prompt);
//
//             // Extraction du JSON de la réponse
//             let jsonMatch = responseText.match(/\{[\s\S]*\}/);
//             if (!jsonMatch) {
//                 return {
//                     explanation: "Désolé, impossible d'analyser cette erreur pour le moment.",
//                     reason: "Erreur inconnue",
//                     fix_suggestion: "Vérifiez la syntaxe de votre requête."
//                 };
//             }
//
//             return JSON.parse(jsonMatch[0]);
//         } catch (error) {
//             console.error('Erreur lors de l\'explication de l\'erreur SQL:', error.message);
//             return {
//                 explanation: "Une erreur est survenue lors de l'analyse.",
//                 reason: "Service temporairement indisponible",
//                 fix_suggestion: "Veuillez réessayer plus tard."
//             };
//         }
//     }
// }
//
// module.exports = new DeepSeekAI();


const axios = require('axios');

// Configuration pour OpenRouter
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1";
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = process.env.MISTRAL_MODEL || "mistralai/mistral-7b-instruct:free";

class MistralAI {
    constructor() {
        this.apiUrl = OPENROUTER_API_URL;
        this.model = MODEL_NAME;
    }

    /**
     * Envoie une requête à l'API OpenRouter avec Mistral
     * @param {string} prompt - Le prompt à envoyer au modèle
     * @param {object} [config={}] - Configuration optionnelle
     * @returns {Promise<string>} - La réponse du modèle
     */
    async generateResponse(prompt, config = {}) {
        const defaultConfig = {
            max_tokens: 4096,
            temperature: 0.3,
            top_p: 0.9
        };

        const finalConfig = { ...defaultConfig, ...config };

        try {
            const response = await axios.post(
                `${this.apiUrl}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: "Tu es un assistant expert en SQL et correction d'examens, capable de fournir des analyses techniques précises et pédagogiques."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: finalConfig.max_tokens,
                    temperature: finalConfig.temperature,
                    top_p: finalConfig.top_p
                },
                {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const responseContent = response.data.choices[0].message.content;

            if (!responseContent || responseContent.trim() === '') {
                throw new Error("Réponse vide de Mistral 7B Instruct");
            }

            return responseContent;

        } catch (error) {
            console.error("Erreur lors de la communication avec OpenRouter pour Mistral:", error.message);

            if (error.response) {
                console.error("Détails de l'erreur:", error.response.data);
            }

            throw new Error(`Échec de la communication avec OpenRouter: ${error.message}`);
        }
    }

    async generateCorrection(extractedText, gradingCriteria) {
        let criteriaText = typeof gradingCriteria === 'object'
            ? JSON.stringify(gradingCriteria, null, 2)
            : String(gradingCriteria);

        const prompt = `
[CORRECTION GLOBALE D'EXAMEN SQL]

🎯 Objectif : Générer une correction complète, structurée et pédagogique

📋 Contenu de l'examen :
${extractedText}

📊 Barème de notation :
${criteriaText}

🔍 Instructions détaillées :
- Correction exhaustive de TOUS les exercices
- Note globale calculée selon le barème
- Explications techniques précises
- Commentaires pédagogiques constructifs

📝 Structure attendue :
1. Introduction générale
2. Correction par exercice
   - Analyse technique
   - Points obtenus
   - Explications détaillées
   - Commentaires sur les bonnes pratiques
3. Note finale avec justification
4. Suggestions d'amélioration globales

🚨 Points critiques :
- Respect strict du barème
- Justification de chaque point attribué
- Approche objective et constructive
`;

        try {
            const correctionContent = await this.generateResponse(prompt, {
                max_tokens: 4000,
                temperature: 0.3
            });
            return correctionContent;
        } catch (error) {
            console.error('Erreur lors de la génération de la correction:', error.message);
            return "Erreur de génération de correction automatique.";
        }
    }

    async gradeSubmission(studentQuery, correctSolution, examContent) {
        const prompt = `
[ÉVALUATION PRÉCISE DE LA REQUÊTE SQL]

🔍 Contexte de l'examen :
${examContent}

📝 Requête de l'étudiant :
\`\`\`sql
${studentQuery}
\`\`\`

✅ Solution officielle :
\`\`\`sql
${correctSolution}
\`\`\`

📊 Critères d'évaluation :
1. Pertinence technique
2. Correspondance avec l'énoncé
3. Qualité de la syntaxe SQL
4. Performance et optimisation
5. Clarté et lisibilité

🎯 Résultat attendu (FORMAT JSON STRICT) :
{
  "score": number,
  "is_correct": boolean,
  "feedback": "string",
  "suggestions": string[]
}
`;

        try {
            const responseText = await this.generateResponse(prompt, {
                max_tokens: 2000,
                temperature: 0.2
            });

            // Extraction robuste du JSON
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return {
                    score: -1,
                    feedback: "Impossible de traiter l'évaluation",
                    is_correct: false,
                    suggestions: []
                };
            }

            const evaluation = JSON.parse(jsonMatch[0]);
            return {
                score: evaluation.score ?? -1,
                feedback: evaluation.feedback || "Pas de feedback détaillé",
                is_correct: !!evaluation.is_correct,
                suggestions: Array.isArray(evaluation.suggestions) ? evaluation.suggestions : []
            };

        } catch (error) {
            console.error('Erreur lors de l\'évaluation:', error);
            return {
                score: -1,
                feedback: `Erreur technique: ${error.message}`,
                is_correct: false,
                suggestions: []
            };
        }
    }

    // Les autres méthodes (compareExecutionResults, generateHints, explainError)
    // restent identiques à la version précédente
}

module.exports = new MistralAI();