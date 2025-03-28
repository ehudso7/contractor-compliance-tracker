#!/bin/bash
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to backend static directory
echo "Copying frontend build to backend..."
rm -rf backend/public
mkdir -p backend/public
cp -r frontend/build/* backend/public/

# Build backend
echo "Building backend..."
cd backend
npm install
cd ..

# Create production .env file if it doesn't exist
if [ ! -f backend/.env.production ]; then
  echo "Creating production environment file..."
  cp backend/.env.example backend/.env.production
  echo "Please update backend/.env.production with your production settings"
  exit 1
fi

# Deploy using Docker
echo "Building and deploying Docker containers..."
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete!"
