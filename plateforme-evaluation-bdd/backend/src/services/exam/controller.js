const { validationResult } = require("express-validator");
const Exam = require("./schema");
const { errorHandler } = require("../../utils/errorHandler");
// const { createEdgeStoreClient } = require("@edgestore/server");
// const edgeStoreClient = createEdgeStoreClient();
const User = require("../users/schema");
const { sendWelcomeEmail } = require("../emailService");

const Correction = require("../correction/schema");
const Submission = require("../submission/schema");
const deepSeekAI = require("../../utils/deepseek"); // Simule l'API DeepSeek
const { extractTextFromFile } = require("../fileExtractor/fileExtractor");
const bucket = require("../../config/firebase"); // Importer Firebase Storage
const PDFDocument = require("pdfkit");
const axios = require("axios");

// 📌 Créer un examen avec un fichier (PDF, Markdown, LaTeX)
// const createExam = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) return next(errorHandler(400, errors.array()));
//
//         const { title, content, deadline, format, gradingCriteria } = req.body;
//         const professorId = req.user.id;
//
//         // Vérifier si un fichier est joint
//         const fileUrl = req.file ? `/uploads/exams/${req.file.filename}` : null;
//         const filePath = req.file ? `./uploads/exams/${req.file.filename}` : null;
//         const exam = await Exam.create({ title, content, deadline, professorId, fileUrl, format, gradingCriteria });
//
//         if(fileUrl !== null) {
//             // Extraire le texte du fichier selon son format
//             const extractedText = await extractTextFromFile(filePath, req.file.mimetype);
//             const correctionContent = await deepSeekAI.generateCorrection(extractedText, gradingCriteria);
//             // 🔥 Stocker la correction en base
//             await Correction.create({
//                 examId: exam.id,
//                 content: correctionContent,
//             });
//
//         }
//
//
//
//         res.status(201).json({ message: "Examen créé avec succès", exam });
//     } catch (error) {
//         next(errorHandler(500, "Erreur lors de la création de l'examen"));
//     }
// };

// const createExam = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) return next(errorHandler(400, errors.array()));
//
//         console.log("Données reçues :", req.body);
//
//         // Extraire les données du corps de la requête
//         const { title, content, deadline: deadlineString, gradingCriteria, students: studentsString, file, format} = req.body;
//         const professorId = req.user.id;
//
//         // Convertir la chaîne `deadline` en objet Date
//         const deadline = new Date(deadlineString);
//
//         // Vérifier si la conversion a réussi
//         if (isNaN(deadline.getTime())) {
//             return next(errorHandler(400, "Format de date invalide pour la deadline"));
//         }
//
//         // Parser les étudiants (si présents)
//         let students = [];
//         if (studentsString) {
//             try {
//                 students = JSON.parse(studentsString); // Convertir la chaîne JSON en tableau
//             } catch (error) {
//                 console.error("Erreur lors du parsing des étudiants :", error);
//                 return next(errorHandler(400, "Format des étudiants invalide"));
//             }
//         }
//
//         // Vérifier si un fichier est joint
//         const fileUrl = req.file ? `/uploads/exams/${req.file.filename}` : null;
//         const filePath = req.file ? `./uploads/exams/${req.file.filename}` : null;
//
//         // Créer l'examen
//         const exam = await Exam.create({
//             title,
//             content,
//             deadline,
//             professorId,
//             fileUrl: file,
//             format,
//             gradingCriteria
//         });
//
//         // ✅ On répond immédiatement pour ne pas bloquer le front
//         res.status(201).json({ message: "Examen en cours de création", exam });
//
//         // 🔥 Lancer la génération de la correction en arrière-plan
//         processCorrection(exam);
//
//         let correctionContent = null;
//
//         if (file !== null) {
//             // Extraire le texte du fichier selon son format
//             const extractedText = await extractTextFromFile(file, format);
//             correctionContent = await deepSeekAI.generateCorrection(extractedText, gradingCriteria);
//
//             console.log("bismillah")
//
//             // Stocker la correction en base
//             await Correction.create({
//                 examId: exam.id,
//                 content: correctionContent,
//             });
//
//             console.log("bismillah")
//         }
//
//         // Traiter les étudiants
//         if (students && Array.isArray(students)) {
//             const studentIds = [];
//
//             for (const student of students) {
//                 // Vérifier si l'étudiant existe déjà
//                 let existingStudent = await User.findOne({ where: { email: student.email } });
//
//                 // Si l'étudiant n'existe pas, le créer
//                 if (!existingStudent) {
//                     existingStudent = await User.create({
//                         email: student.email,
//                         prenom: student.prenom,
//                         nom: student.nom,
//                         password: 'passer', // Mot de passe par défaut
//                         role: 'student',
//                         status: 'active'
//                     });
//
//                     // 🎉 Envoyer un email de bienvenue avec les identifiants
//                     await sendWelcomeEmail(existingStudent.email, existingStudent.prenom, existingStudent.nom);
//                 }
//
//                 // Ajouter l'ID de l'étudiant à la liste
//                 studentIds.push(existingStudent.id);
//             }
//
//             // Créer des soumissions vides pour chaque étudiant
//             const submissionPromises = studentIds.map(studentId =>
//                 Submission.create({
//                     studentId,
//                     examId: exam.id,
//                     content: " ", // Contenu initialement vide
//                     status: 'assigned' // Statut initial
//                 })
//             );
//
//             await Promise.all(submissionPromises);
//         }
//
//         res.status(201).json({ message: "Examen créé avec succès et assigné aux étudiants", exam });
//     } catch (error) {
//         console.error("Erreur lors de la création de l'examen :", error);
//         next(errorHandler(500, "Erreur lors de la création de l'examen"));
//     }
// };

const createExam = async (req, res, next) => {
  try {
    // Validation des données d'entrée
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(errorHandler(400, errors.array()));

    console.log("📥 Données reçues :", req.body);

    // Extraire les données du corps de la requête
    const {
      title,
      content,
      deadline: deadlineString,
      gradingCriteria,
      students: studentsString,
      file,
      format,
    } = req.body;
    const professorId = req.user.id;

    // 📌 Convertir la date de deadline
    const deadline = new Date(deadlineString);
    if (isNaN(deadline.getTime())) {
      return next(
        errorHandler(400, "Format de date invalide pour la deadline")
      );
    }

    // 📌 Parser les étudiants (si présents)
    let students = [];
    if (studentsString) {
      try {
        students = JSON.parse(studentsString);
      } catch (error) {
        console.error("❌ Erreur parsing étudiants :", error);
        return next(errorHandler(400, "Format des étudiants invalide"));
      }
    }
    // 📌 Créer l'examen en BDD avec file tel quel (URL déjà fournie)
    const exam = await Exam.create({
      title,
      content,
      deadline,
      professorId,
      fileUrl: file, // Conserver file comme dans le code d'origine
      format,
      gradingCriteria,
    });
    // 📌 Traiter les étudiants et créer les soumissions AVANT de lancer processCorrection
    if (students && Array.isArray(students)) {
      const studentPromises = students.map(async (student) => {
        let existingStudent = await User.findOne({
          where: { email: student.email },
        });

        // Si l'étudiant n'existe pas, le créer
        if (!existingStudent) {
          existingStudent = await User.create({
            email: student.email,
            prenom: student.prenom,
            nom: student.nom,
            password: "P@sser12345",
            role: "student",
            status: "active",
          });

          // 🎉 Envoyer un email de bienvenue
          try {
            await sendWelcomeEmail(
              existingStudent.email,
              existingStudent.prenom,
              existingStudent.nom
            );
          } catch (emailError) {
            console.error(
              "⚠️ Erreur lors de l'envoi de l'email de bienvenue:",
              emailError
            );
            // Continuer même si l'email échoue
          }
        }

        // Créer la soumission
        return Submission.create({
          studentId: existingStudent.id,
          examId: exam.id,
          content: " ",
          status: "assigned",
        });
      });

      // Attendre que toutes les soumissions soient créées
      await Promise.all(studentPromises);
    }

    // ✅ Répondre au client
    res.status(201).json({
      success: true,
      message: "Examen créé avec succès",
      exam,
    });

    // 🔥 Lancer la génération de la correction en arrière-plan APRÈS avoir répondu au client
    processCorrection(exam, file, format, gradingCriteria).catch((error) => {
      console.error("❌ Erreur lors du traitement de la correction :", error);
      // Gérer l'erreur de correction en arrière-plan
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'examen :", error);
    next(errorHandler(500, "Erreur lors de la création de l'examen"));
  }
};

const processCorrection = async (exam, file, format, gradingCriteria) => {
  try {
    console.log(`🔄 Génération de la correction pour l'examen ${exam.id}...`);

    let correctionContent = null;

    if (file !== null) {
      // 📌 Extraire le texte du fichier
      const extractedText = await extractTextFromFile(file, format);

      // 📌 Générer une correction avec DeepSeek AI
      correctionContent = await deepSeekAI.generateCorrection(
        extractedText,
        gradingCriteria
      );

      console.log("✅ Correction générée pour l'examen :", exam.id);

      // 📌 Stocker la correction en tant que brouillon (draft)
      // const draftCorrection = await Correction.create({
      //   examId: exam.id,
      //   content: correctionContent,
      //   // Statut "brouillon"
      // });

      // 🔥 Nettoyage du texte généré
      correctionContent = correctionContent
          .replace(/###/g, '') // Supprime les titres Markdown
          .replace(/\*\*/g, '') // Supprime les **gras**
          .replace(/```json|```/g, '') // Supprime les blocs de code JSON
          .trim();

      // 🔥 Vérification JSON
      try {
        JSON.parse(JSON.stringify({ correction: correctionContent }));
      } catch (error) {
        console.error("❌ Erreur JSON détectée, transformation en texte brut :", error);
        correctionContent = correctionContent.replace(/["']/g, ""); // Supprimer les guillemets erronés
      }


      // 📡 Notifier le professeur via WebSockets
      io.emit(`correctionPending:${exam.professorId}`, {
        message: "Votre correction est prête à être révisée.",
        examId: exam.id,
        correction: correctionContent,
      });
    }
  } catch (error) {
    console.error(`❌ Erreur génération correction examen ${exam.id}:`, error);
  }
};

// 📌 Voir tous les examens d’un professeur
const getAllExams = async (req, res, next) => {
  try {
    const exams = await Exam.findAll({
      where: { professorId: req.user.id },
      include: [
        {
          model: Correction,
          as: "correction", // Alias défini dans l'association
          attributes: ["id", "content", "createdAt"], // Récupérer uniquement les colonnes nécessaires
        },
      ],
    });

    res.status(200).json(exams);
  } catch (error) {
    next(errorHandler(500, "Erreur lors de la récupération des examens"));
  }
};

// 📌 Voir tous les examens d’un professeur
const getAllExamsByAdmin = async (req, res, next) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (error) {
    next(errorHandler(500, "Erreur lors de la récupération des examens"));
  }
};

// 📌 Récupérer un examen spécifique
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return next(errorHandler(404, "Examen non trouvé"));

    res.status(200).json(exam);
  } catch (error) {
    next(errorHandler(500, "Erreur lors de la récupération de l'examen"));
  }
};

// 📌 Mettre à jour un examen
const updateExam = async (req, res, next) => {
  try {
    const { title, content, deadline, format, gradingCriteria, fileUrl } =
      req.body;
    const exam = await Exam.findByPk(req.params.id);

    // Vérifier si l'examen existe
    if (!exam) return next(errorHandler(404, "Examen non trouvé"));

    // Vérifier si un fichier est joint
    //const fileUrl = req.file ? `/uploads/exams/${req.file.filename}` : exam.fileUrl;
    // 🔥 Si un fichier est uploadé, supprimer l'ancien fichier sur Edge Store
    if (req.file) {
      if (exam.fileUrl) {
        await edgeStoreClient.publicFiles.delete({ url: exam.fileUrl });
      }
      const uploadedFile = await edgeStoreClient.publicFiles.upload({
        file: req.file,
      });
      exam.fileUrl = uploadedFile.url;
    }

    // Mettre à jour l'examen avec les nouvelles données
    await exam.update({
      title,
      content,
      deadline,
      format,
      gradingCriteria,
      fileUrl,
    });

    res.status(200).json({ message: "Examen mis à jour avec succès", exam });
  } catch (error) {
    next(errorHandler(500, "Erreur lors de la mise à jour de l'examen"));
  }
};

// 📌 Supprimer un examen
const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return next(errorHandler(404, "Examen non trouvé"));
    // 🔥 Supprimer le fichier Edge Store si présent
    if (exam.fileUrl)
      await edgeStoreClient.publicFiles.delete({ url: exam.fileUrl });

    await exam.destroy();
    res.status(200).json({ message: "Examen supprimé avec succès" });
  } catch (error) {
    next(errorHandler(500, "Erreur lors de la suppression de l'examen"));
  }
};

// 📂 Télécharger un fichier depuis Firebase et l’envoyer au client
const downloadExamFile = async (req, res, next) => {
  try {
    // Récupérer le nom du fichier depuis les paramètres de la route
    const fileName = req.params.fileName;

    if (!fileName) {
      return res.status(400).json({ error: "Nom du fichier manquant." });
    }

    // Construire l'URL Firebase complète
    const fileUrl = `https://firebasestorage.googleapis.com/v0/b/nbcmultiservices-9db9b.appspot.com/o/uploads%2Fdocuments%2F${fileName}?alt=media`;

    console.log("URL de téléchargement :", fileUrl);

    // Télécharger le fichier depuis l'URL Firebase
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    // Déterminer le Content-Type approprié en fonction de l'extension
    let contentType = "text/plain"; // Par défaut

    if (fileName.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (fileName.endsWith(".tex") || fileName.endsWith(".latex")) {
      contentType = "application/x-latex";
    } else if (fileName.endsWith(".md") || fileName.endsWith(".markdown")) {
      contentType = "text/markdown";
    }

    // Configurer les headers pour le téléchargement
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", contentType);

    // Envoyer le fichier
    res.send(response.data);
  } catch (error) {
    console.error("❌ Erreur lors du téléchargement :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

const createExamCorrection = async (req, res, next) => {
  try {
    const { examId } = req.params;
    let { content } = req.body;
    const professorId = req.user.id;

    // Vérifier si l'examen existe
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return next(errorHandler(404, "Examen non trouvé"));
    }

    // Vérifier si le professeur est bien celui qui a créé l'examen
    if (exam.professorId !== professorId) {
      return next(errorHandler(403, "Accès refusé"));
    }

    // Sauvegarde directe du contenu sans transformation JSON
    let correction = await Correction.findOne({ where: { examId } });

    if (correction) {
      // Mettre à jour la correction existante
      correction.content = content;
      await correction.save();
    } else {
      // Créer une nouvelle correction
      correction = await Correction.create({
        examId,
        content
      });
    }

    res.status(200).json({
      message: "Correction mise à jour avec succès",
      correction
    });

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de la correction :", error);
    next(errorHandler(500, "Erreur serveur"));
  }
};
module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getAllExamsByAdmin,
  downloadExamFile,
  createExamCorrection
};
