const fs = require('fs');
const fsPromises = fs.promises;
const os = require('os');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

/**
 * Génère un nom de fichier temporaire unique
 * @param {string} extension - Extension du fichier (.pdf, .tex, etc.)
 * @returns {string} - Chemin complet du fichier temporaire
 */
const createTempFile = async (extension = '') => {
    // Génère un nom de fichier unique
    const randomString = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const fileName = `temp_${timestamp}_${randomString}${extension}`;

    // Crée le chemin complet
    return path.join(os.tmpdir(), fileName);
};

/**
 * Nettoie un fichier temporaire s'il existe
 * @param {string} filePath - Chemin du fichier à supprimer
 */
const cleanupTempFile = async (filePath) => {
    try {
        if (filePath) {
            await fsPromises.access(filePath, fs.constants.F_OK);
            await fsPromises.unlink(filePath);
        }
    } catch (err) {
        // Ignore les erreurs si le fichier n'existe pas
    }
};

/**
 * Télécharge un fichier depuis une URL Firebase
 * @param {string} url - URL du fichier à télécharger
 * @param {string} destPath - Chemin de destination pour le fichier
 * @returns {Promise<string>} - Chemin du fichier téléchargé
 */
const downloadFileFromURL = async (url, destPath) => {
    try {
        // Vérifier si l'URL est valide
        if (!url || typeof url !== 'string') {
            throw new Error('URL invalide');
        }

        // Télécharger le fichier
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            timeout: 30000 // 30 secondes de timeout
        });

        // Créer un flux d'écriture
        const writer = fs.createWriteStream(destPath);

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);

            writer.on('error', err => {
                writer.close();
                reject(err);
            });

            writer.on('close', () => {
                resolve(destPath);
            });
        });
    } catch (error) {
        // Nettoyer en cas d'erreur
        await cleanupTempFile(destPath);

        if (error.response) {
            throw new Error(`Erreur lors du téléchargement (${error.response.status}): ${url}`);
        } else if (error.request) {
            throw new Error(`Aucune réponse reçue: ${url}`);
        } else {
            throw new Error(`Erreur de configuration: ${error.message}`);
        }
    }
};

/**
 * Obtient le type MIME d'un fichier à partir de son URL
 * @param {string} url - URL du fichier
 * @returns {string|null} - Type MIME ou null si indéterminé
 */
const getMimeTypeFromURL = (url) => {
    // Extraire l'extension du fichier
    const extension = path.extname(url).toLowerCase();

    // Mapper les extensions aux types MIME
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.tex': 'application/x-tex',
        '.latex': 'application/x-tex',
        '.md': 'text/markdown',
        '.markdown': 'text/markdown',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.doc': 'application/msword',
        '.txt': 'text/plain'
    };

    return mimeTypes[extension] || null;
};

/**
 * Vérifie si une URL Firebase est accessible
 * @param {string} url - URL à vérifier
 * @returns {Promise<boolean>} - true si accessible, sinon false
 */
const isFirebaseUrlAccessible = async (url) => {
    try {
        await axios.head(url);
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = {
    createTempFile,
    cleanupTempFile,
    downloadFileFromURL,
    getMimeTypeFromURL,
    isFirebaseUrlAccessible
};