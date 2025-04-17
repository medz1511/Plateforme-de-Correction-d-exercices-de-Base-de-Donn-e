const { downloadFileFromURL, createTempFile, cleanupTempFile } = require('../../utils/file_utils');
const pdfParse = require('pdf-parse');
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs').promises;

// Extraction de texte depuis un PDF à partir d'une URL Firebase
const extractTextFromPDF = async (fileUrl) => {
    const tempFilePath = await createTempFile('.pdf');

    try {
        // Télécharger le fichier
        await downloadFileFromURL(fileUrl, tempFilePath);

        // Extraire le texte
        const dataBuffer = await fs.readFile(tempFilePath);
        const data = await pdfParse(dataBuffer);

        // Nettoyer
        await cleanupTempFile(tempFilePath);

        return data.text;
    } catch (error) {
        await cleanupTempFile(tempFilePath);
        console.error("Erreur lors de l'extraction du PDF:", error);
        throw new Error(`Impossible d'extraire le texte du PDF: ${error.message}`);
    }
};

// Extraction de texte depuis un fichier LaTeX à partir d'une URL Firebase
const extractTextFromLaTeX = async (fileUrl) => {
    const tempFilePath = await createTempFile('.tex');

    try {
        // Télécharger le fichier
        await downloadFileFromURL(fileUrl, tempFilePath);

        // Lire le contenu
        const data = await fs.readFile(tempFilePath, 'utf8');

        // Nettoyer
        await cleanupTempFile(tempFilePath);

        // Traitement du contenu LaTeX
        let text = data;

        // Supprimer les commandes LaTeX courantes
        text = text.replace(/\\[a-zA-Z]+(\{[^}]*\})?/g, ' ');

        // Supprimer les environnements
        text = text.replace(/\\begin\{[^}]*\}([\s\S]*?)\\end\{[^}]*\}/g, '$1');

        // Nettoyer les accolades restantes et autres symboles spéciaux
        text = text.replace(/\{|\}|\\|\$/g, ' ');

        // Nettoyer les espaces multiples
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    } catch (error) {
        await cleanupTempFile(tempFilePath);
        console.error("Erreur lors de l'extraction du LaTeX:", error);
        throw new Error(`Impossible d'extraire le texte du fichier LaTeX: ${error.message}`);
    }
};

// Extraction de texte depuis un fichier Markdown à partir d'une URL Firebase
const extractTextFromMarkdown = async (fileUrl) => {
    const tempFilePath = await createTempFile('.md');

    try {
        // Télécharger le fichier
        await downloadFileFromURL(fileUrl, tempFilePath);

        // Lire le contenu
        const data = await fs.readFile(tempFilePath, 'utf8');

        // Nettoyer
        await cleanupTempFile(tempFilePath);

        // Convertir Markdown en HTML
        const html = marked.parse(data);

        // Supprimer les balises HTML
        const text = sanitizeHtml(html, {
            allowedTags: [],
            allowedAttributes: {},
        });

        return text;
    } catch (error) {
        await cleanupTempFile(tempFilePath);
        console.error("Erreur lors de l'extraction du Markdown:", error);
        throw new Error(`Impossible d'extraire le texte du fichier Markdown: ${error.message}`);
    }
};

// Extraction de texte depuis un fichier TXT à partir d'une URL Firebase
const extractTextFromTXT = async (fileUrl) => {
    const tempFilePath = await createTempFile('.txt');

    try {
        // Télécharger le fichier
        await downloadFileFromURL(fileUrl, tempFilePath);

        // Lire le contenu
        const text = await fs.readFile(tempFilePath, 'utf8');

        // Nettoyer
        await cleanupTempFile(tempFilePath);

        return text;
    } catch (error) {
        await cleanupTempFile(tempFilePath);
        console.error("Erreur lors de l'extraction du TXT:", error);
        throw new Error(`Impossible d'extraire le texte du fichier TXT: ${error.message}`);
    }
};

// Fonction principale d'extraction selon le type de fichier
const extractTextFromFile = async (fileUrl, mimeType) => {
    try {
        // Déterminer le type de fichier
        if (mimeType === 'application/pdf' || fileUrl.toLowerCase().endsWith('.pdf')) {
            return await extractTextFromPDF(fileUrl);
        }
        else if (mimeType === 'application/x-tex' ||
            fileUrl.toLowerCase().endsWith('.tex') ||
            fileUrl.toLowerCase().endsWith('.latex')) {
            return await extractTextFromLaTeX(fileUrl);
        }
        else if (mimeType === 'text/markdown' ||
            fileUrl.toLowerCase().endsWith('.md') ||
            fileUrl.toLowerCase().endsWith('.markdown')) {
            return await extractTextFromMarkdown(fileUrl);
        }
        else if (mimeType === 'text/plain' ||
            fileUrl.toLowerCase().endsWith('.txt')) {
            return await extractTextFromTXT(fileUrl);
        }
        else {
            throw new Error(`Format de fichier non supporté: ${mimeType}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'extraction du texte:', error);
        throw error;
    }
};

module.exports = {
    extractTextFromPDF,
    extractTextFromLaTeX,
    extractTextFromMarkdown,
    extractTextFromTXT,
    extractTextFromFile
};