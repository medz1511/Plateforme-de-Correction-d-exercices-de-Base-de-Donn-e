FROM node:18-alpine

WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier les fichiers sources
COPY . .

# Créer le répertoire d'upload
RUN mkdir -p ./uploads && chmod 777 ./uploads

# Exposer le port du serveur
EXPOSE 3002

# Commande de démarrage
CMD ["node", "app.js"]