#!/bin/bash

ENV_FILE=".env"

# Color constants
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
RESET="\033[0m"

# -------------------------
# 🧰 Utility Functions
# -------------------------

# Remove surrounding quotes and trim whitespace
sanitize_value() {
    local val="$1"
    val="${val%\"}"     # Remove trailing "
    val="${val#\"}"     # Remove leading "
    val="$(echo -e "${val}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"  # Trim
    echo "$val"
}

# Read value from .env file by key
read_env() {
    local key="$1"
    local val=$(grep -E "^${key}=" "$ENV_FILE" | cut -d '=' -f2-)
    echo "$(sanitize_value "$val")"
}

# Set value in env, preserving structure
update_env_file() {
    local key="$1"
    local value="$2"
    local tmp_file=$(mktemp)

    local updated=0

    while IFS= read -r line || [ -n "$line" ]; do
        if [[ "$line" =~ ^[[:space:]]*# || -z "$line" ]]; then
            echo "$line" >> "$tmp_file"
            continue
        fi

        if [[ "$line" =~ ^${key}= ]]; then
            echo "${key}=${value}" >> "$tmp_file"
            updated=1
        else
            echo "$line" >> "$tmp_file"
        fi
    done < "$ENV_FILE"

    if [[ $updated -eq 0 ]]; then
        echo "${key}=${value}" >> "$tmp_file"
    fi

    mv "$tmp_file" "$ENV_FILE"
}

# -------------------------
# 🚀 Main Script
# -------------------------

# 1. Check if .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}❌ Error: $ENV_FILE file not found.${RESET}"
    exit 1
fi

# 2. Read values from package.json
PACKAGE_NAME=$(sanitize_value "$(node -p "require('./package.json').name || 'empty_name'")")
PACKAGE_VERSION=$(sanitize_value "$(node -p "require('./package.json').version || '0.0.1'")")

# 3. Read required values from .env
DOCKER_USERNAME=$(read_env "DOCKER_USERNAME")
EMAIL=$(read_env "EMAIL")

if [[ -z "$DOCKER_USERNAME" || -z "$EMAIL" ]]; then
    echo -e "${RED}❌ Missing DOCKER_USERNAME or EMAIL in .env${RESET}"
    exit 1
else
    echo -e "${YELLOW}✅ Captured DOCKER_USERNAME and EMAIL${RESET}"
fi

# 4. Compose image tag
IMAGE_TAG="${DOCKER_USERNAME}/${PACKAGE_NAME}:${PACKAGE_VERSION}"

# 5. Update dynamic values in .env
echo -e "${BLUE}🔄 Updating values in .env...${RESET}"
update_env_file "PACKAGE_NAME" "$PACKAGE_NAME"
update_env_file "PACKAGE_VERSION" "$PACKAGE_VERSION"
update_env_file "IMAGE_TAG" "$IMAGE_TAG"

# 6. Display summary
echo -e "${GREEN}✅ Updated values:${RESET}"
echo -e "   DOCKER_USERNAME: $DOCKER_USERNAME"
echo -e "   PACKAGE_NAME: $PACKAGE_NAME"
echo -e "   PACKAGE_VERSION: $PACKAGE_VERSION"
echo -e "   EMAIL: $EMAIL"
echo -e "   IMAGE_TAG: $IMAGE_TAG"

# 7. Push to GitHub secrets
echo -e "${BLUE}🚀 Uploading secrets to GitHub...${RESET}"

if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) not found. Please install it.${RESET}"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI not authenticated. Run 'gh auth login'.${RESET}"
    exit 1
fi

while IFS= read -r line || [ -n "$line" ]; do
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi

    if [[ "$line" =~ ^([A-Z_][A-Z0-9_]*)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        raw_value="${BASH_REMATCH[2]}"

        # Special handling for MAIL_PASS (preserve quotes)
        if [[ "$key" == "MAIL_PASS" ]]; then
            value="${raw_value}"
            [[ "$value" != \"* ]] && value="\"$value\""
        else
            value=$(sanitize_value "$raw_value")
        fi

        echo -e "${GREEN}✨ Setting secret:${RESET} ${BLUE}${key}${RESET}"
        if gh secret set "$key" --body "$value" &>/dev/null; then
            echo -e "${GREEN}✅ Secret $key set successfully.${RESET}"
        else
            echo -e "${RED}❌ Failed to set secret: $key${RESET}"
        fi
    else
        echo -e "${YELLOW}⚠️ Skipping invalid line: $line${RESET}"
    fi
done < "$ENV_FILE"

echo -e "${BLUE}🎉 Done! All secrets uploaded.${RESET}"
