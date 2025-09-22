FROM node:18-alpine

WORKDIR /app

# Copier et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

ENV NODE_ENV=production
EXPOSE 8000

# Utiliser directement node en production
CMD ["node", "server.js"]