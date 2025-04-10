output "vercel_project_name" {
  value = vercel_project.frontend.name
}

output "render_service_url" {
  value = render_service.backend_api.service_details[0].url
}
