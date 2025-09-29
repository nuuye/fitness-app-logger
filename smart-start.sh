#!/bin/bash

# smart-start.sh - Script intelligent adaptatif local/EC2
#chmod +x smart-start.sh
#./smart-start.sh

set -e

echo "🚀 Démarrage intelligent de l'application..."

# Détecter l'environnement
detect_environment() {
    if curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id >/dev/null 2>&1; then
        echo "ec2"
    else
        echo "local"
    fi
}

# Fonction pour récupérer l'IP selon l'environnement
get_public_ip() {
    local env=$(detect_environment)
    
    if [ "$env" = "ec2" ]; then
        # Récupérer le token IMDSv2 (obligatoire sur cette instance)
        local token=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
            -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" \
            --max-time 5 2>/dev/null)
        
        if [ -z "$token" ]; then
            echo "localhost"
            return
        fi
        
        # Récupérer l'IP publique avec le token
        local ip=$(curl -s -H "X-aws-ec2-metadata-token: $token" \
            http://169.254.169.254/latest/meta-data/public-ipv4 \
            --max-time 5 2>/dev/null)
        
        if [ $? -eq 0 ] && [ ! -z "$ip" ]; then
            echo "$ip"
        else
            echo "localhost"
        fi
    else
        echo "localhost"
    fi
}

# Détecter l'environnement et l'IP
ENV_TYPE=$(detect_environment)
CURRENT_IP=$(get_public_ip)

echo "> Environnement détecté: $ENV_TYPE"
echo "> IP configurée: $CURRENT_IP"

# Adapter NODE_ENV selon l'environnement
if [ "$ENV_TYPE" = "ec2" ]; then
    TARGET_NODE_ENV="production"
    echo "🏭 Mode production (EC2)"
else
    TARGET_NODE_ENV="development"
    echo "🔧 Mode développement (local)"
fi

# Vérifier si l'IP ou l'environnement a changé
NEED_REBUILD=false
if [ -f ".env" ]; then
    OLD_IP=$(grep "^EC2_PUBLIC_IP=" .env | cut -d'=' -f2 2>/dev/null || echo "")
    OLD_ENV=$(grep "^NODE_ENV=" .env | cut -d'=' -f2 2>/dev/null || echo "")
    
    if [ "$OLD_IP" != "$CURRENT_IP" ]; then
        echo "> L'IP a changé de '$OLD_IP' vers '$CURRENT_IP'"
        NEED_REBUILD=true
    fi
    
    if [ "$OLD_ENV" != "$TARGET_NODE_ENV" ]; then
        echo "> L'environnement a changé de '$OLD_ENV' vers '$TARGET_NODE_ENV'"
        NEED_REBUILD=true
    fi
    
    if [ "$NEED_REBUILD" = false ]; then
        echo "> Configuration inchangée"
    fi
else
    echo "📝 Création du fichier .env"
    NEED_REBUILD=true
fi

# Mettre à jour le .env racine
if [ -f ".env" ]; then
    cp .env .env.backup
    grep -v "^EC2_PUBLIC_IP=" .env.backup | grep -v "^NODE_ENV=" > .env.tmp || touch .env.tmp
    echo "NODE_ENV=$TARGET_NODE_ENV" >> .env.tmp
    echo "EC2_PUBLIC_IP=$CURRENT_IP" >> .env.tmp
    mv .env.tmp .env
else
    cat > .env << EOF
NODE_ENV=$TARGET_NODE_ENV
EC2_PUBLIC_IP=$CURRENT_IP
EOF
fi

echo "📄 Fichier .env racine mis à jour"

# Mettre à jour le frontend/.env selon l'environnement
if [ -f "frontend/.env" ]; then
    echo "📝 Mise à jour du frontend/.env..."
    cp frontend/.env frontend/.env.backup
    
    if [ "$ENV_TYPE" = "ec2" ]; then
        # Sur EC2 : remplacer localhost par l'IP réelle
        sed -i "s|http://localhost:8000|http://$CURRENT_IP:8000|g" frontend/.env
        echo "(frontend)> URLs mises à jour: localhost → $CURRENT_IP"
    else
        # En local : s'assurer que c'est localhost
        sed -i "s|http://[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:8000|http://localhost:8000|g" frontend/.env
        echo "(frontend)> URLs mises à jour pour développement local"
    fi
    
    # Mettre à jour NODE_ENV
    if grep -q "^NODE_ENV=" frontend/.env; then
        sed -i "s/^NODE_ENV=.*/NODE_ENV=$TARGET_NODE_ENV/" frontend/.env
    fi
    
    echo "(frontend)📋 URLs d'API configurées:"
    grep "NEXT_PUBLIC_API_" frontend/.env | while IFS= read -r line; do
        echo "   * $line"
    done
else
    echo "⚠️ Fichier frontend/.env non trouvé"
    echo "> Créez-le avec vos variables sensibles et les URLs appropriées"
fi

# Mettre à jour le backend/.env selon l'environnement
if [ -f "backend/.env" ]; then
    echo "📝 Mise à jour du backend/.env..."
    cp backend/.env backend/.env.backup
    
    if [ "$ENV_TYPE" = "ec2" ]; then
        # Sur EC2 : remplacer localhost par l'IP réelle
        sed -i "s/^CORS_IP=.*/CORS_IP=$CURRENT_IP:3000/" backend/.env
        echo "(backend)> URLs mises à jour: localhost → $CURRENT_IP"
    else
        # En local : s'assurer que c'est localhost
        sed -i "s|http://[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+:3000|http://localhost:3000|g" backend/.env
        echo "(backend)> URLs mises à jour pour développement local"
    fi
    
    # Mettre à jour NODE_ENV
    if grep -q "^NODE_ENV=" backend/.env; then
        sed -i "s/^NODE_ENV=.*/NODE_ENV=$TARGET_NODE_ENV/" backend/.env
    fi
else
    echo "⚠️ Fichier backend/.env non trouvé"
    echo "> Créez-le avec vos variables sensibles et les URLs appropriées"
fi

# Gestion Docker selon l'environnement
if [ "$ENV_TYPE" = "local" ] && [ "$NEED_REBUILD" = true ]; then
    echo "🧹 Nettoyage Docker pour éviter les conflits..."
    docker-compose down --remove-orphans 2>/dev/null || true
    docker system prune -f >/dev/null 2>&1 || true
fi

# Démarrer ou redémarrer les conteneurs
if [ "$NEED_REBUILD" = true ] || [ "$1" = "--force" ]; then
    echo "🔨 Reconstruction et redémarrage des conteneurs..."
    docker-compose down 2>/dev/null || true
    docker-compose up --build -d
else
    echo "> Démarrage des conteneurs existants..."
    docker-compose up -d
fi

# Check status
echo ""
echo "📊 Statut des conteneurs:"
docker-compose ps

echo ""
echo "¤ Application disponible sur:"
echo "   Frontend: http://$CURRENT_IP:3000"
echo "   Backend:  http://$CURRENT_IP:8000"
echo ""
echo "🔧 Configuration:"
echo "   Environnement: $ENV_TYPE ($TARGET_NODE_ENV)"
echo "   IP: $CURRENT_IP"
echo ""
echo "¤ Pour forcer une reconstruction: $0 --force"