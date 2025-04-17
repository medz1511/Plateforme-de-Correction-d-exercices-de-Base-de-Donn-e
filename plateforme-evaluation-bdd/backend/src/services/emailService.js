// emailService.js
require("dotenv").config();
const nodemailer = require('nodemailer');

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWD,
    }
});

// Fonction pour envoyer un email de confirmation de création de compte
const sendAccountApprovalEmail = async (teacherEmail, Prenom, Nom) => {
    try {
        const mailOptions = {
            from: `"Data-Eval" <${process.env.EMAIL_USER}>`,
            to: teacherEmail,
            subject: 'Votre compte a été approuvé',
            html: `
        <h1>Félicitations ${Prenom} ${Nom}!</h1>
        <p>Votre demande de création de compte professeur a été approuvée par l'administrateur.</p>
        <p>Vous pouvez maintenant vous connecter à l'application Data Eval avec vos identifiants.</p>
        <p>Cordialement,<br>L'équipe administrative</p>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return { success: true, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return { success: false, message: 'Erreur lors de l\'envoi de l\'email', error };
    }
};

const sendWelcomeEmail = async (email, prenom, nom) => {
    try {
        const mailOptions = {
            from: `"Data-Eval" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Bienvenue sur Data-Eval 🎉 - Accès à votre compte étudiant",
            html: `
                <h2>Bonjour ${prenom} ${nom},</h2>
                <p>Bienvenue sur <strong>Data-Eval</strong>, la plateforme d'évaluation automatisée.</p>
                <p>Votre compte a été créé avec succès. Voici vos informations de connexion :</p>
                <ul>
                    <li><strong>Identifiant :</strong> ${email}</li>
                    <li><strong>Mot de passe :</strong> P@sser12345</li>
                </ul>
                <p>Veuillez vous connecter via: https://data-eval-frontend.onrender.com/login et changer votre mot de passe dès que possible.</p>
                <p>Bonne chance pour vos examens !</p>
                <p>L'équipe Data-Eval 🚀</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email envoyé avec succès à ${to}`);
    } catch (error) {
        console.error(`❌ Erreur lors de l'envoi de l'email à ${to} :`, error);
    }
};
module.exports = {
    sendAccountApprovalEmail,
    sendWelcomeEmail
    // Vous pouvez ajouter d'autres fonctions d'envoi d'emails ici
};