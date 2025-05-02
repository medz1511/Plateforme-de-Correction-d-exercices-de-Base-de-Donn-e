# 📚 Plateforme intelligente d’évaluation automatisée des exercices de bases de données

Une application web full-stack permettant aux professeurs de publier des sujets de bases de données, aux étudiants de soumettre leurs devoirs, et à une intelligence artificielle (DeepSeek via Ollama) de corriger automatiquement les soumissions. Le tout est déployé avec Docker et utilise AWS S3 pour le stockage des fichiers.

---

## 🧠 Fonctionnalités

### 👨‍🏫 Professeur :
- Publier des sujets avec fichiers PDF.
- Visualiser et télécharger les soumissions des étudiants.
- Consulter les notes générées par l’IA.
- Corriger manuellement si nécessaire.
- Uploader des modèles de correction.

### 👨‍🎓 Étudiant :
- Voir les devoirs disponibles.
- Soumettre leur travail en PDF.
- Visualiser la note automatique.
- Consulter la correction de l’IA.

### ⚙️ Système :
-Correction automatique par l’IA via DeepSeek (Ollama).

-Stockage cloud AWS S3 pour les fichiers PDF.

-Interface utilisateur moderne avec React.js + Tailwind CSS.

-API REST sécurisée via Node.js/Express avec authentification OAuth2.

-Statistiques dynamiques et visualisations via des graphiques.

---

## 🛠️ Technologies utilisées

| Composant       | Technologie                |
|-----------------|----------------------------|
| Frontend        | React.js, Vite, Tailwind CSS |
| Backend         | Node.js, Express.js        |
| IA              | Ollama + DeepSeek          |
| Base de données | MySQL                      |
| Stockage        | AWS S3 (ou compatible S3)  |
| Authentification| JWT, bcrypt                |
| DevOps          | Docker, Docker Compose     |


---

## 📦 Installation locale (sans Docker)

1. **Cloner le dépôt** :
   git clone https://github.com/votre-utilisateur/plateforme-evaluation-bdd.git
   
   cd plateforme-evaluation-bdd
   
3. **Configurer la base de données MySQL**
   
5. **Backend**:
   
         cd backend
   
         npm install
   
         npm run sync  # Synchronisation des modèles Sequelize

         npm start
   
4.**Frontend**

     npm install
     
     npm run dev

## 🔐 Fichier .env (à placer dans /backend/.env)
⚠️ Ne jamais exposer ce fichier en public !

        ## === Google OAuth2 ===
      ### Identifiant client Google pour l'authentification OAuth2
      GOOGLE_CLIENT_ID=your_google_client_id
      ### Secret client Google pour OAuth2
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      ### URL de redirection après authentification Google
      GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
      ### URL du frontend de l'application (pour les CORS, redirections, etc.)
      FRONTEND_URL=http://localhost:5173
      
      ## === GitHub OAuth2 ===
      ### Identifiant client GitHub pour l'authentification OAuth2
      GITHUB_CLIENT_ID=your_github_client_id
      ### Secret client GitHub pour OAuth2
      GITHUB_CLIENT_SECRET=your_github_client_secret
      ### URL de redirection après authentification GitHub
      GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback
      
      ## === Authentification interne ===
      ### Clé secrète pour les sessions (utilisée pour signer les cookies de session)
      SESSION_SECRET=your_session_secret
      ### Clé secrète pour signer/valider les JSON Web Tokens (JWT)
      JWT_SECRET=your_jwt_secret
      
      ## === AWS S3 ===
      ### Identifiant d'accès AWS (clé publique)
      AWS_ACCESS_KEY_ID=your_aws_access_key_id
      ### Clé secrète d'accès AWS
      AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
      ### Région AWS (exemple : eu-west-3, us-east-1, etc.)
      AWS_REGION=your_aws_region
      ### Nom du bucket S3 utilisé pour stocker les fichiers
      S3_BUCKET_NAME=your_s3_bucket_name
      
      ## === DeepSeek (IA) ===
      ### Nom du modèle DeepSeek utilisé (peut inclure version ou tag docker)
      DEEPSEEK_MODEL=deepseek-coder:latest
      
      ## === Email notifications (SMTP) ===
      ### Adresse email utilisée pour envoyer les notifications
      EMAIL_USER=your_email_user
      ### Mot de passe ou app password associé à l'email (généralement un mot de passe d'application, pas le vrai mot de passe de la boîte mail)
      EMAIL_PASS=your_email_app_password

----
---
## 📥 **Comptes nécessaires**

Avant d’utiliser le projet, vous devez **impérativement** créer les comptes suivants :

> 👉 **Google OAuth2** : [https://console.developers.google.com](https://console.developers.google.com)  
> 👉 **GitHub OAuth** : [https://github.com/settings/developers](https://github.com/settings/developers)  
> 👉 **AWS S3** : [https://console.aws.amazon.com/s3](https://console.aws.amazon.com/s3)  
> 👉 **DeepSeek (via Ollama)** : [https://ollama.com](https://ollama.com) (installation locale requise)

---

## ✅ **Tests**

Les fonctionnalités suivantes ont été **testées et validées** :

- 🔄 **Synchronisation des modèles Sequelize**
- 🔐 **Authentification via Google et GitHub testée**
- ☁️ **Upload et accès aux fichiers via S3**
- 📝 **Évaluation IA validée sur fichiers PDF**
- 📊 **Dashboard statistique fonctionnel**

---
---

## 📸 **Captures **
---

- 🖼️ **Page de login**
  ![image](https://github.com/user-attachments/assets/9ba158af-07f0-4aa4-bad8-e4eb9dd1c19c)
---
- 📤 **Soumission de devoir**
  ![image](https://github.com/user-attachments/assets/3c234d07-0897-4acd-a905-368df7266e4b)
---
- 🤖 **Résultat de l'IA**

  ![image](https://github.com/user-attachments/assets/12733a9e-7451-48d4-9897-863113c0ddbf)
  
---

![image](https://github.com/user-attachments/assets/518d9f98-b91f-439f-9926-977046d86f02)

---

![image](https://github.com/user-attachments/assets/0ffd9e25-4077-4be9-b0ed-c03e2c8259f7)

---

![image](https://github.com/user-attachments/assets/f37b11d3-41cb-459f-a5ac-74ddb86622c4)

------

- 📈 **Tableau de bord étudiant**
  ![WhatsApp Image 2025-05-02 à 21 45 24_3a1fdd52](https://github.com/user-attachments/assets/435697cc-ba10-4ba8-bd93-f7d081a72266)

  ---
  
- ⬇️ **Téléchargement par le professeur**
  ![image](https://github.com/user-attachments/assets/58dcc65b-0bff-4f3b-bc8c-724ccc72f4c8)


---

## 📌 **Auteur**

Développé par :

[Mouhamed Amar](https://github.com/mouhamedamar141) 

[Mohamed Mbaye](https://github.com/mhxii) 

[Sokhna Diarra Ndiaye](https://github.com/diarra004) 

[Babacar Ndiaye](https://github.com/ndiaye47) 

[Mohamed Sall](https://github.com/medz1511) 


avec ❤️  
Licence **MIT**
Copyright Kounama Mai 2025
