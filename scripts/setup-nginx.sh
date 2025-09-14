#!/bin/bash
set -euo pipefail

echo "🚀 Starting NGINX + HTTPS deployment..."

# === Load env ===
if [[ -f .env ]]; then
  echo "Loading environment variables from .env file..."
  # cleanup .env
  sed -i 's/\r//' .env
  sed -i 's/[[:space:]]*$//' .env
  sed -i '/^$/d' .env
  sed -i '/^#/d' .env

  while IFS='=' read -r key value; do
    if [[ -z "$key" || "$key" =~ ^# ]]; then continue; fi
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
    export "$key=$value"
    echo "Setting: $key=$value"
  done < .env
fi

# Defaults
BASE_URL="${BASE_URL:-localhost}"
EMAIL="${EMAIL:-admin@example.com}"
PACKAGE_NAME="${PACKAGE_NAME:-myapp}"
PORT="${PORT:-5056}"

# Determine if BASE_URL is domain or IP/localhost
if [[ "$BASE_URL" == "localhost" || "$BASE_URL" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  USE_SELF_SIGNED=true
  PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
  echo "📡 Using IP-based access: $PUBLIC_IP"
else
  USE_SELF_SIGNED=false
fi

# Prepare folders
mkdir -p nginx/conf.d nginx/certbot/www nginx/certbot/conf nginx/selfsigned

# NGINX config
if [[ "$USE_SELF_SIGNED" == true ]]; then
  # Generate self-signed cert if not already
  if [[ ! -f "nginx/selfsigned/fullchain.pem" ]]; then
    bash scripts/generate-self-signed-cert.sh "$PUBLIC_IP"
  fi

cat > nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name $PUBLIC_IP;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $PUBLIC_IP;

    ssl_certificate /etc/nginx/selfsigned/fullchain.pem;
    ssl_certificate_key /etc/nginx/selfsigned/privkey.pem;

    location / {
        proxy_pass http://app:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

else

cat > nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name $BASE_URL;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $BASE_URL;

    ssl_certificate /etc/letsencrypt/live/$BASE_URL/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$BASE_URL/privkey.pem;

    location / {
        proxy_pass http://app:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

fi

echo "📝 NGINX config updated."

# Stop old containers
docker rm -f "${PACKAGE_NAME}_nginx" "${PACKAGE_NAME}_certbot" "${PACKAGE_NAME}_certbot_renew" 2>/dev/null || true

# Start base services
docker-compose up -d app nginx

# Certbot only for domain
if [[ "$USE_SELF_SIGNED" == false ]]; then
  CERT_PATH="nginx/certbot/conf/live/$BASE_URL/fullchain.pem"
  if [[ ! -f "$CERT_PATH" ]]; then
    echo "🔐 First-time certbot run..."
    docker-compose run --rm certbot
  else
    echo "✅ SSL already exists — skipping certbot issue."
  fi

  docker-compose restart nginx
  docker-compose up -d certbot-renew
else
  echo "🔒 Self-signed SSL active — skipping certbot."
fi

echo "✅ Setup complete:"
echo "  ➤ Public: https://$([[ $USE_SELF_SIGNED == true ]] && echo $PUBLIC_IP || echo $BASE_URL)"