FROM node:20-slim

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste des fichiers
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads/subjects uploads/corrections uploads/submissions temp

# Exposer le port
EXPOSE 3004

# Commande de démarrage
CMD ["node", "server.js"]