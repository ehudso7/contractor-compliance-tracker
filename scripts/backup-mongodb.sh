#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/backups/mongodb"
MONGODB_HOST="mongodb"
MONGODB_PORT="27017"
MONGODB_USER="admin"
MONGODB_PASSWORD="password"
MONGODB_DATABASE="contractor-compliance"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_PATH="${BACKUP_DIR}/${MONGODB_DATABASE}_${DATE}"
DAYS_TO_KEEP=14

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Run MongoDB backup
echo "Creating backup of ${MONGODB_DATABASE} database..."
mongodump \
  --host ${MONGODB_HOST} \
  --port ${MONGODB_PORT} \
  --username ${MONGODB_USER} \
  --password ${MONGODB_PASSWORD} \
  --db ${MONGODB_DATABASE} \
  --authenticationDatabase admin \
  --out ${BACKUP_PATH}

# Compress backup
echo "Compressing backup..."
tar -czf "${BACKUP_PATH}.tar.gz" -C ${BACKUP_DIR} "$(basename ${BACKUP_PATH})"
rm -rf ${BACKUP_PATH}

# Delete old backups
echo "Removing backups older than ${DAYS_TO_KEEP} days..."
find ${BACKUP_DIR} -name "${MONGODB_DATABASE}_*.tar.gz" -type f -mtime +${DAYS_TO_KEEP} -delete

echo "Backup completed: ${BACKUP_PATH}.tar.gz"
