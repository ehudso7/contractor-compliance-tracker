#!/bin/bash
set -e

echo "▶️ Preparing environment..."

cp .env.production frontend/.env.local
cp .env.backend backend/.env

echo "▶️ Triggering production deployment..."

git checkout production
git pull origin main
git push origin production

echo "✅ Deployment triggered to Vercel and Render."

