-- Création d'une base de données
CREATE DATABASE IF NOT EXISTS GestionDevoirs;

-- Sélectionner la base de données à utiliser
USE GestionDevoirs;

-- Création de la table pour stocker les devoirs
CREATE TABLE IF NOT EXISTS Devoirs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    grade INT,
    maxGrade INT NOT NULL,
    status ENUM('Corrigé', 'En attente', 'Refusé') NOT NULL,
    studentFile VARCHAR(255) NOT NULL,
    correctionFile VARCHAR(255)
);

-- Insertion de données dans la table
INSERT INTO Devoirs (title, grade, maxGrade, status, studentFile, correctionFile)
VALUES 
    ('Requête SQL avancée', 16, 20, 'Corrigé', '/upload/Memo_final.pdf', '/upload/ExamenMaster1.pdf'),
    ('Modélisation relationnelle', 14, 20, 'Corrigé', '/upload/Devoir_Modélisation.pdf', '/upload/Correction_Modélisation.pdf'),
    ('Indexation et performance', NULL, 20, 'En attente', '/upload/Devoir_Indexation.pdf', NULL),
    ('Transactions et ACID', NULL, 20, 'Refusé', '/upload/Devoir_Transactions.pdf', NULL);

-- Sélectionner les devoirs avec leurs informations
SELECT * FROM Devoirs;

-- Mise à jour de la note pour un devoir
UPDATE Devoirs
SET grade = 18
WHERE id = 1;

-- Suppression d'un devoir
DELETE FROM Devoirs WHERE id = 4;
