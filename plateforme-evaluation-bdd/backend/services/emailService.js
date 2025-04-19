// backend/services/emailService.js
const nodemailer = require('nodemailer');
const db = require('../models');

// Créer un transporteur avec les variables d'environnement
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Utilise l'adresse email définie dans .env
    pass: process.env.EMAIL_PASS   // Utilise le mot de passe défini dans .env
  }
});

const sendEmailToStudents = async (subject) => {
  try {
    // Récupérer tous les étudiants
    const students = await db.utilisateur.findAll({
      where: { role: 'ETUDIANT' }
    });

    // Pour chaque étudiant, envoyer un email
    for (let student of students) {
      let mailOptions = {
        from: process.env.EMAIL_USER, // Utiliser l'adresse e-mail définie dans .env
        to: student.email,
        subject: `Nouveau sujet publié: ${subject.titre}`,
        text: `
          Bonjour ${student.prenom} ${student.nom},
          
          Un nouveau sujet a été publié. Voici les détails:
          
          Titre: ${subject.titre}
          Description: ${subject.description}
          Date limite: ${subject.date_limite}
          
          Vous pouvez consulter le sujet et soumettre votre travail sur notre plateforme.
          
          Cordialement,
          L'équipe pédagogique`
      };

      // Envoi de l'email
      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
  }
};

module.exports = { sendEmailToStudents };