// services/correctionIAService.js
const db = require('../models');

module.exports = {
  corrigerSoumission: async soumissionId => {
    const note = Math.floor(Math.random() * 21);
    const commentaire = note > 10 ? "Bon travail" : "Peut mieux faire";
    await db.soumission.update(
      { etat: 'CORRIGE', note_automatique: note, commentaire_ia: commentaire },
      { where: { id: soumissionId } }
    );
    const soum = await db.soumission.findByPk(soumissionId);
    const sujet = await db.sujet.findByPk(soum.sujet_id);
    await db.notification.create({
      titre: `Note dispo : ${sujet.titre}`,
      message: `Votre devoir "${sujet.titre}" a été noté : ${note}/20`,
      type: 'NOTE_DISPONIBLE',
      utilisateur_id: soum.etudiant_id
    });
    return { note, commentaire };
  }
};
