#!/bin/bash

REPO=$1
if [ -z "$REPO" ]; then
  echo "Usage: ./setup-github-secrets.sh <owner/repo>"
  exit 1
fi

gh secret set SUPABASE_URL --repo "$REPO" --body "https://xyz.supabase.co"
gh secret set SUPABASE_KEY --repo "$REPO" --body "your-supabase-service-key"
gh secret set JWT_SECRET_KEY --repo "$REPO" --body "your-jwt-secret"
gh secret set STRIPE_SECRET_KEY --repo "$REPO" --body "your-stripe-secret"
gh secret set OPENAI_API_KEY --repo "$REPO" --body "your-openai-key"
gh secret set ANTHROPIC_API_KEY --repo "$REPO" --body "your-anthropic-key"
gh secret set SENTRY_AUTH_TOKEN --repo "$REPO" --body "your-sentry-auth-token"
gh secret set SENTRY_DSN --repo "$REPO" --body "your-sentry-dsn"

echo "✅ GitHub secrets configured for $REPO"

