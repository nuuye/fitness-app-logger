# Step 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm install

# Copier le code et builder
COPY . .
RUN npm run build

# Step 2: Run the app
FROM node:18-alpine
WORKDIR /app

# Copier seulement les fichiers nécessaires depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Par défaut en prod
ENV NODE_ENV=production
EXPOSE 3000

# Lancement conditionnel
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start -- -p 3000 -H 0.0.0.0; else npm run dev -- -p 3000 -H 0.0.0.0; fi"]