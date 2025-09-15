# Step 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Step 2: Run the app
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./

# Exposer le port
ENV NODE_ENV=production
EXPOSE 8000

# CMD conditionnel dev/prod
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then node server.js; else npm run dev; fi"]
