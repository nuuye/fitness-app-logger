#!/bin/bash

# smart-start.sh - Script intelligent adaptatif local/EC2
# chmod +x smart-start.sh
# ./smart-start.sh

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

# Mise à jour du DNS CloudFlare
if [ "$ENV_TYPE" = "ec2" ]; then
    # --- CONFIG ---
    CF_API_TOKEN=$(grep "^CF_API_TOKEN=" .env | cut -d'=' -f2 2>/dev/null || echo "")
    ZONE_ID=$(grep "^ZONE_ID=" .env | cut -d'=' -f2 2>/dev/null || echo "")
    RECORD_NAME=$(grep "^RECORD_NAME=" .env | cut -d'=' -f2 2>/dev/null || echo "")

    if [ -z "$CF_API_TOKEN" ] || [ -z "$ZONE_ID" ] || [ -z "$RECORD_NAME" ]; then
        echo "❌ Variables Cloudflare manquantes dans le .env"
        exit 1
    fi

    # Récupération de l'ID de l'enregistrement DNS sur Cloudflare
    RECORD_ID=$(curl -s -X GET \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=$RECORD_NAME" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result[0].id')

    if [ "$RECORD_ID" = "null" ]; then
        echo "❌ Impossible de trouver l'enregistrement DNS $RECORD_NAME dans la zone Cloudflare."
        exit 1
    fi

    # Récupération de l'ID de l'enregistrement DNS api sur Cloudflare
    API_RECORD_ID=$(curl -s -X GET \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?name=api.$RECORD_NAME" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result[0].id')

    if [ "$API_RECORD_ID" = "null" ]; then
        echo "❌ Impossible de trouver l'enregistrement DNS api dans la zone Cloudflare."
        exit 1
    fi

    # Récupération de l'IP enregistrée sur Cloudflare pour frontend
    CLOUDFLARE_OLD_IP=$(curl -s -X GET \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result.content')

    # Récupération de l'IP enregistrée sur Cloudflare pour le backend
    CLOUDFLARE_OLD_API_IP=$(curl -s -X GET \
        "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$API_RECORD_ID" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result.content')

    # Comparaison pour frontend
    if [ "$CURRENT_IP" = "$CLOUDFLARE_OLD_IP" ]; then
        echo "✅ L'IP Cloudflare est déjà à jour ($CURRENT_IP)."
    else
        echo "🔄 Mise à jour de l'enregistrement DNS..."
        UPDATE=$(curl -s -X PUT \
            "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{\"type\":\"A\",\"name\":\"$RECORD_NAME\",\"content\":\"$CURRENT_IP\",\"ttl\":120,\"proxied\":true}")

        if echo "$UPDATE" | grep -q '"success":true'; then
            echo "✅ Enregistrement mis à jour : $RECORD_NAME → $CURRENT_IP"
        else
            echo "❌ Erreur lors de la mise à jour Cloudflare :"
            echo "$UPDATE"
        fi
    fi

    # Comparaison pour backend
    if [ "$CURRENT_IP" = "$CLOUDFLARE_OLD_API_IP" ]; then
        echo "✅ L'IP api Cloudflare est déjà à jour ($CURRENT_IP)."
    else
        echo "🔄 Mise à jour de l'enregistrement DNS api..."
        UPDATE=$(curl -s -X PUT \
            "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$API_RECORD_ID" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{\"type\":\"A\",\"name\":\"api.$RECORD_NAME\",\"content\":\"$CURRENT_IP\",\"ttl\":120,\"proxied\":true}")

        if echo "$UPDATE" | grep -q '"success":true'; then
            echo "✅ Enregistrement mis à jour : api → $CURRENT_IP"
        else
            echo "❌ Erreur lors de la mise à jour api Cloudflare :"
            echo "$UPDATE"
        fi
    fi
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
if [ "$ENV_TYPE" = "ec2" ]; then
    echo "   DNS Cloudflare: $RECORD_NAME → $CURRENT_IP"
    echo "   DNS API Cloudflare: api → $CURRENT_IP"
fi
echo ""
echo "¤ Pour forcer une reconstruction: $0 --force"