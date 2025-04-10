terraform {
  required_providers {
    render = {
      source  = "github.com/renderinc/render"
      version = "0.0.5"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "0.11.4"
    }
  }
}

provider "render" {
  api_key = var.render_api_key
}

provider "vercel" {
  api_token = var.vercel_api_token
}

resource "render_service" "backend_api" {
  name           = "command-my-startup-api"
  type           = "web_service"
  repo           = "https://github.com/YOUR_ORG/command-my-startup"
  branch         = "production"
  build_command  = "pip install -r requirements.txt"
  start_command  = "uvicorn main:app --host 0.0.0.0 --port 8000"
  env_vars = {
    ENVIRONMENT    = "production"
    SUPABASE_URL   = var.supabase_url
    SUPABASE_KEY   = var.supabase_key
    JWT_SECRET_KEY = var.jwt_secret
  }
}
