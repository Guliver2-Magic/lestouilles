#!/bin/bash

# Les Touillés - Deployment Script
# This script automates the deployment process on Ubuntu server

set -e  # Exit on error

echo "========================================="
echo "Les Touillés - Deployment Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create a .env file with all required environment variables."
    echo "See ENV_VARIABLES.md for the complete list."
    exit 1
fi

echo -e "${GREEN}✓ .env file found${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed!${NC}"
    echo "Please install Docker first: https://docs.docker.com/engine/install/ubuntu/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose first."
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}"
echo ""

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down || true

# Build and start containers
echo ""
echo "Building Docker images..."
docker-compose build --no-cache

echo ""
echo "Starting containers..."
docker-compose up -d

# Wait for database to be ready
echo ""
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
echo ""
echo "Running database migrations..."
docker-compose exec -T app pnpm db:push || echo -e "${YELLOW}Warning: Database migration failed. You may need to run it manually.${NC}"

# Show container status
echo ""
echo "========================================="
echo "Deployment Status"
echo "========================================="
docker-compose ps

echo ""
echo "========================================="
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "========================================="
echo ""
echo "Your application is now running at:"
echo "  - http://localhost:3000"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f app"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "To restart the application:"
echo "  docker-compose restart"
echo ""
