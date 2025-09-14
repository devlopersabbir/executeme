set -e

CERT_DIR="nginx/selfsigned"
mkdir -p "$CERT_DIR"

# Set default values
IP=${1:-127.0.0.1}
DAYS=365

echo "🔐 Generating self-signed cert for IP: $IP"

openssl req -x509 -nodes -days $DAYS -newkey rsa:2048 \
  -keyout "$CERT_DIR/privkey.pem" \
  -out "$CERT_DIR/fullchain.pem" \
  -subj "/CN=$IP"

echo "✅ Self-signed certificate created at $CERT_DIR/"