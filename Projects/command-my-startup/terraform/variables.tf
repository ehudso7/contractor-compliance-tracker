variable "render_api_key" {
  type        = string
  description = "Render API key"
}

variable "vercel_api_token" {
  type        = string
  description = "Vercel API token"
}

variable "backend_repo_url" {
  type        = string
  description = "GitHub repo URL for backend"
}

variable "supabase_url" {
  type        = string
  description = "Supabase URL"
}

variable "supabase_key" {
  type        = string
  description = "Supabase API key"
}

variable "jwt_secret" {
  type        = string
  description = "JWT secret key"
}

variable "stripe_secret_key" {
  type        = string
  description = "Stripe secret key"
}

variable "stripe_webhook_secret" {
  type        = string
  description = "Stripe webhook signing secret"
}

variable "vercel_domain" {
  type        = string
  description = "Custom domain for Vercel frontend"
}
