#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/backups/mongodb"
MONGODB_HOST="mongodb"
MONGODB_PORT="27017"
MONGODB_USER="admin"
MONGODB_PASSWORD="password"
MONGODB_DATABASE="contractor-compliance"

# Check if backup file is provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <backup_file>"
  echo "Available backups:"
  ls -1 ${BACKUP_DIR}/${MONGODB_DATABASE}_*.tar.gz
  exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
  echo "Backup file not found: ${BACKUP_DIR}/${BACKUP_FILE}"
  exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
trap 'rm -rf ${TEMP_DIR}' EXIT

# Extract backup
echo "Extracting backup..."
tar -xzf "${BACKUP_DIR}/${BACKUP_FILE}" -C ${TEMP_DIR}

# Restore database
echo "Restoring ${MONGODB_DATABASE} database..."
mongorestore \
  --host ${MONGODB_HOST} \
  --port ${MONGODB_PORT} \
  --username ${MONGODB_USER} \
  --password ${MONGODB_PASSWORD} \
  --authenticationDatabase admin \
  --nsInclude="${MONGODB_DATABASE}.*" \
  --drop \
  ${TEMP_DIR}/${MONGODB_DATABASE}

echo "Restore completed!"
