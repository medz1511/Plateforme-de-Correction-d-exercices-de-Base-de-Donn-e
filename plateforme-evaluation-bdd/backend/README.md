# 🚀 Data Eval - Backend API

**API pour la gestion et correction automatisée d'exercices SQL**  
*Powered by DeepSeek via Ollama*

---

## ⚙️ Stack Technique

| Technologie | Badge | Description |
|-------------|-------|-------------|
| Node.js | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Environnement d'exécution JavaScript |
| Express | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | Framework backend minimaliste |
| PostgreSQL | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) | Base de données relationnelle |
| Ollama | ![Ollama](https://img.shields.io/badge/Ollama-00A86B?style=flat-square) | Serveur local de LLM |
| DeepSeek | ![DeepSeek](https://img.shields.io/badge/DeepSeek-FF9900?style=flat-square) | Modèle IA pour correction SQL |
| JWT | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | Authentification sécurisée |
| Firebase | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=white) | Stockage des fichiers |

---

## 📂 Architecture

data-eval-back/
┣ src/
┃ ┣ controllers/ # Logique métier
┃ ┣ routes/ # Définition des endpoints
┃ ┣ models/ # Schémas de données
┃ ┣ services/ # Services externes
┃ ┣ middlewares/ # Intercepteurs
┃ ┣ utils/ # Helpers
┃ ┣ server.js # Point d'entrée
┃ ┗ package.json # Dépendances
Copy


---

## ✨ Fonctionnalités

- 🔐 **Authentification** (Professeurs/Administrateurs)
- 📝 **Gestion des examens** (Création/Modification)
- 🤖 **Correction automatique** via DeepSeek
- 📤 **Soumission des devoirs** par étudiants
- 📊 **Gestion des notes** et rapports
- 🔒 **Sécurité** JWT pour tous les endpoints

---

## 🛠 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/mouhameddiagne2003/data-eval-back.git
cd data-eval-back

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env

🔧 Variables d'environnement

PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/data_eval
JWT_SECRET=votre_clé_secrète
OLLAMA_URL=http://localhost:11434
USER_EMAIL=...
USER_PASSWD=... ( via mdp d applications google )

🚀 Lancer l'application

# Mode développement
npm run dev
