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

COPY --from=builder /app ./

# Par défaut en prod
ENV NODE_ENV=production
EXPOSE 3000

# Lancement conditionnel
# docker run -e NODE_ENV=production
# docker run -e NODE_ENV=development ...
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start -p 3000 -H 0.0.0.0; else npm run dev -p 3000 -H 0.0.0.0; fi"]
