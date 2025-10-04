#!/bin/bash

# Configuration
BACKUP_DIR="/backups/postgres"
BACKUP_DAYS=7
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
DB_NAME="foundercrm"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

# Create backup
echo "Creating backup: $BACKUP_FILE"
docker-compose -f $DOCKER_COMPOSE_FILE exec -T db pg_dump -U postgres $DB_NAME > $BACKUP_FILE

# Compress backup
echo "Compressing backup..."
gzip $BACKUP_FILE

# Remove old backups
echo "Removing backups older than $BACKUP_DAYS days..."
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$BACKUP_DAYS -delete

# Check backup file exists and has size greater than 0
if [ -s "${BACKUP_FILE}.gz" ]; then
    echo "Backup completed successfully"
else
    echo "Backup failed!"
    exit 1
fi