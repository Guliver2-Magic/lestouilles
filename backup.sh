#!/bin/bash

# Les Touillés - Database Backup Script
# This script creates a backup of the MySQL database

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env file not found!${NC}"
    exit 1
fi

# Create backups directory if it doesn't exist
mkdir -p ./backups

# Generate backup filename with timestamp
BACKUP_FILE="./backups/lestouilles_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "========================================="
echo "Les Touillés - Database Backup"
echo "========================================="
echo ""
echo "Creating backup: $BACKUP_FILE"

# Create database backup
docker-compose exec -T db mysqldump \
    -u${MYSQL_USER} \
    -p${MYSQL_PASSWORD} \
    ${MYSQL_DATABASE} > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"

echo ""
echo -e "${GREEN}✓ Backup completed successfully!${NC}"
echo "Backup file: ${BACKUP_FILE}.gz"
echo ""

# Keep only last 7 days of backups
find ./backups -name "lestouilles_backup_*.sql.gz" -mtime +7 -delete
echo "Old backups (>7 days) cleaned up."
echo ""
