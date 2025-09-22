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

# Build conditionnel pour Next.js
RUN if [ "$NODE_ENV" = "production" ]; then \
        echo "Building Next.js for production..." && \
        npm run build; \
    else \
        echo "Development mode - skipping build"; \
    fi

EXPOSE 3000

# Commande conditionnelle au runtime
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then echo 'Starting production server...' && npm run start -- -p 3000 -H 0.0.0.0; else echo 'Starting development server...' && npm run dev -- -p 3000 -H 0.0.0.0; fi"]