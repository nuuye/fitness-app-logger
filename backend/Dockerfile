FROM node:18-alpine

WORKDIR /app

# Récupérer NODE_ENV depuis les build args
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Copier les fichiers package
COPY package*.json ./

# Installation conditionnelle des dépendances
RUN if [ "$NODE_ENV" = "production" ]; then \
        echo "Installing production dependencies..." && \
        npm ci --only=production && npm cache clean --force; \
    else \
        echo "Installing all dependencies..." && \
        npm install; \
    fi

# Copier le code source
COPY . .

EXPOSE 8000

# Commande conditionnelle au runtime
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then echo 'Starting production server...' && node server.js; else echo 'Starting development server...' && npm run dev; fi"]