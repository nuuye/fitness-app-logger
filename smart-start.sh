#!/bin/bash

#chmod +x smart-start.sh
#./smart-start.sh

set -e

echo "Démarrage intelligent de l'application..."

# Fonction pour récupérer l'IP publique
get_public_ip() {
    local ip=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null)
    if [ $? -eq 0 ] && [ ! -z "$ip" ]; then
        echo "$ip"
    else
        echo "localhost"
    fi
}

# Récupérer l'IP actuelle
CURRENT_IP=$(get_public_ip)
echo "📍 IP publique détectée: $CURRENT_IP"

# Vérifier si l'IP a changé
if [ -f ".env" ]; then
    OLD_IP=$(grep "^EC2_PUBLIC_IP=" .env | cut -d'=' -f2)
    if [ "$OLD_IP" != "$CURRENT_IP" ]; then
        echo "🔄 L'IP a changé de $OLD_IP vers $CURRENT_IP"
        NEED_REBUILD=true
    else
        echo "✅ L'IP n'a pas changé"
        NEED_REBUILD=false
    fi
else
    echo "📝 Création du fichier .env"
    NEED_REBUILD=true
fi

# Mettre à jour le .env
cat > .env << EOF
NODE_ENV=production
EC2_PUBLIC_IP=$CURRENT_IP
EOF

echo "📄 Fichier .env mis à jour"

# Démarrer ou redémarrer les conteneurs
if [ "$NEED_REBUILD" = true ] || [ "$1" = "--force" ]; then
    echo "🔨 Reconstruction et redémarrage des conteneurs..."
    docker-compose down 2>/dev/null || true
    docker-compose up --build -d
else
    echo "▶️ Démarrage des conteneurs existants..."
    docker-compose up -d
fi

# Vérifier le statut
echo "📊 Statut des conteneurs:"
docker-compose ps

echo ""
echo "   Application disponible sur:"
echo "   Frontend: http://$CURRENT_IP:3000"
echo "   Backend:  http://$CURRENT_IP:8000"
echo ""
echo "   Pour forcer une reconstruction: $0 --force"