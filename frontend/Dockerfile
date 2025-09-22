FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source
COPY . .

# Build conditionnel selon l'environnement
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

# Commande conditionnelle dev/prod
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start -- -p 3000 -H 0.0.0.0; else npm run dev -- -p 3000 -H 0.0.0.0; fi"]