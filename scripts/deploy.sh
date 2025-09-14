#!/bin/bash

# Simplified Zero Downtime Deployment Script
# Usage: ./deploy.sh --version <version> [--rollback] [status]

set -e

# Configuration
PACKAGE_NAME="${PACKAGE_NAME:-server}"
DOCKER_USERNAME="${DOCKER_USERNAME:-devlopersabbir}"
HEALTH_ENDPOINT="http://localhost:5000/"
HEALTH_TIMEOUT=30
HEALTH_RETRIES=6

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS] [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  status                    Show current deployment status"
    echo "  --version <version>       Deploy specified version"
    echo "  --rollback               Rollback to previous version"
    echo ""
    echo "Options:"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --version 0.3.3"
    echo "  $0 --rollback"
    echo "  $0 status"
}

# Function to get current running version
get_current_version() {
    if docker ps --filter "name=${PACKAGE_NAME}_api" --format "table {{.Image}}" | grep -v "IMAGE" | head -1 | cut -d':' -f2; then
        return 0
    else
        echo "none"
        return 1
    fi
}

# Function to get previous version from version history file
get_previous_version() {
    local version_file="./deployment_versions.txt"
    if [ -f "$version_file" ] && [ -s "$version_file" ]; then
        # Get the second to last version (previous version)
        tail -n 2 "$version_file" | head -n 1 || echo "none"
    else
        echo "none"
    fi
}

# Function to save version to history
save_version_to_history() {
    local version=$1
    local version_file="./deployment_versions.txt"
    echo "$version" >> "$version_file"
    # Keep only last 10 versions
    tail -n 10 "$version_file" > "${version_file}.tmp" && mv "${version_file}.tmp" "$version_file"
}

# Simple health check using curl
check_health() {
    local container_name=$1
    local max_attempts=${2:-$HEALTH_RETRIES}
    local attempt=1
    
    log_info "Checking health for container: $container_name"
    
    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts"
        
        # Check if container is running first
        if ! docker ps --filter "name=$container_name" --format "{{.Names}}" | grep -q "^$container_name$"; then
            log_error "Container $container_name is not running"
            return 1
        fi
        
        # Simple curl check for the endpoint
        if curl -f -s --connect-timeout 5 --max-time 10 "$HEALTH_ENDPOINT" | grep -q '"status":"ok"'; then
            log_success "Health check passed - endpoint returned status: ok"
            return 0
        fi
        
        log_info "Waiting for service to be ready... (${HEALTH_TIMEOUT}s)"
        sleep $HEALTH_TIMEOUT
        attempt=$((attempt + 1))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to stop and remove container
cleanup_container() {
    local container_name=$1
    
    if docker ps -a --filter "name=$container_name" --format "{{.Names}}" | grep -q "^$container_name$"; then
        log_info "Stopping and removing container: $container_name"
        docker stop "$container_name" 2>/dev/null || true
        docker rm "$container_name" 2>/dev/null || true
        log_success "Container $container_name cleaned up"
    fi
}

# Function to perform rollback
perform_rollback() {
    local current_version=$(get_current_version)
    local previous_version=$(get_previous_version)
    
    if [ "$previous_version" = "none" ]; then
        log_error "No previous version found for rollback"
        return 1
    fi
    
    log_warning "Rolling back from version $current_version to $previous_version"
    
    # Stop current container
    cleanup_container "${PACKAGE_NAME}_api"
    
    # Deploy previous version
    deploy_version "$previous_version"
    
    if [ $? -eq 0 ]; then
        log_success "Rollback to version $previous_version completed successfully"
        return 0
    else
        log_error "Rollback failed"
        return 1
    fi
}

# Function to deploy a specific version
deploy_version() {
    local version=$1
    local image_tag="${DOCKER_USERNAME}/${PACKAGE_NAME}:${version}"
    local new_container="${PACKAGE_NAME}_api"
    local old_container="${PACKAGE_NAME}_api_old"
    
    log_info "Starting deployment of version $version"
    log_info "Image: $image_tag"
    
    # Check if image exists locally or pull it
    if ! docker image inspect "$image_tag" > /dev/null 2>&1; then
        log_info "Pulling image: $image_tag"
        if ! docker pull "$image_tag"; then
            log_error "Failed to pull image: $image_tag"
            return 1
        fi
    fi
    
    # Rename current container to old if it exists
    if docker ps --filter "name=${new_container}" --format "{{.Names}}" | grep -q "^${new_container}$"; then
        log_info "Renaming current container to backup"
        docker rename "$new_container" "$old_container" 2>/dev/null || true
    fi
    
    # Update .env file with new version
    if [ -f .env ]; then
        sed -i "s/PACKAGE_VERSION=.*/PACKAGE_VERSION=\"$version\"/" .env
        log_info "Updated .env file with version $version"
    fi
    
    # Start new container
    log_info "Starting new container with version $version"
    if docker compose --profile prod up -d app; then
        log_success "New container started successfully"
    else
        log_error "Failed to start new container"
        # Restore old container if it exists
        if docker ps -a --filter "name=${old_container}" --format "{{.Names}}" | grep -q "^${old_container}$"; then
            log_info "Restoring previous container"
            docker rename "$old_container" "$new_container" 2>/dev/null || true
            docker start "$new_container" 2>/dev/null || true
        fi
        return 1
    fi
    
    # Wait a bit for container to initialize
    log_info "Waiting for new container to initialize..."
    sleep 15
    
    # Perform simple health check
    if check_health "$new_container"; then
        log_success "New container is healthy"
        
        # Clean up old container
        cleanup_container "$old_container"
        
        # Save version to history
        save_version_to_history "$version"
        
        log_success "Deployment of version $version completed successfully"
        return 0
    else
        log_error "New container failed health check, rolling back"
        
        # Stop and remove failed container
        cleanup_container "$new_container"
        
        # Restore old container if it exists
        if docker ps -a --filter "name=${old_container}" --format "{{.Names}}" | grep -q "^${old_container}$"; then
            log_info "Restoring previous container"
            docker rename "$old_container" "$new_container"
            docker start "$new_container"
            
            # Quick check on restored container
            sleep 10
            if curl -f -s --connect-timeout 5 --max-time 10 "$HEALTH_ENDPOINT" | grep -q '"status":"ok"'; then
                log_success "Previous container restored successfully"
            else
                log_warning "Previous container restored but health check uncertain"
            fi
        fi
        
        return 1
    fi
}

# Function to show deployment status
show_status() {
    echo "=== Deployment Status ==="
    
    local current_version=$(get_current_version)
    local previous_version=$(get_previous_version)
    
    echo "Current Version: $current_version"
    echo "Previous Version: $previous_version"
    echo ""
    
    # Show running containers
    echo "=== Running Containers ==="
    docker ps --filter "name=${PACKAGE_NAME}" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    
    # Show health status
    echo "=== Health Status ==="
    if docker ps --filter "name=${PACKAGE_NAME}_api" --format "{{.Names}}" | grep -q "${PACKAGE_NAME}_api"; then
        # Test HTTP endpoint
        if curl -f -s --connect-timeout 5 --max-time 10 "$HEALTH_ENDPOINT" | grep -q '"status":"ok"'; then
            echo "HTTP Endpoint: ✅ Healthy (status: ok)"
        else
            echo "HTTP Endpoint: ❌ Unhealthy or not responding"
        fi
    else
        echo "No running containers found"
    fi
    
    echo ""
    
    # Show recent deployment history
    if [ -f "./deployment_versions.txt" ]; then
        echo "=== Recent Deployments ==="
        tail -n 5 "./deployment_versions.txt" | nl -v1 -s'. ' | sort -r
    fi
}

# Main script logic
case "$1" in
    --version)
        if [ -z "$2" ]; then
            log_error "Version parameter is required"
            show_usage
            exit 1
        fi
        deploy_version "$2"
        ;;
    --rollback)
        perform_rollback
        ;;
    status)
        show_status
        ;;
    --help)
        show_usage
        ;;
    *)
        log_error "Invalid command: $1"
        show_usage
        exit 1
        ;;
esac