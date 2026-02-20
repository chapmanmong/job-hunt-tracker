# output "frontend_url" {
#   description = "Frontend application URL"
#   value       = "https://${var.frontend_url}"
# }

# output "backend_url" {
#   description = "Backend API URL"
#   value       = "https://${var.backend_url}"
# }

# output "cloudfront_distribution_id" {
#   description = "CloudFront distribution ID (needed for cache invalidation in CI/CD)"
#   value       = module.cloudfront.distribution_id
# }

# output "ecr_repository_url" {
#   description = "ECR repository URL (needed for pushing Docker images in CI/CD)"
#   value       = module.ecr.repository_url
# }

# output "ecs_cluster_name" {
#   description = "ECS cluster name (needed for deployments in CI/CD)"
#   value       = module.ecs.cluster_name
# }

# output "ecs_service_name" {
#   description = "ECS service name (needed for deployments in CI/CD)"
#   value       = module.ecs.service_name
# }

# output "rds_endpoint" {
#   description = "RDS database endpoint"
#   value       = module.rds.endpoint
#   sensitive   = true
# }

output "route53_nameservers" {
  description = "Route53 nameservers - add these to GoDaddy for jh.chapmanmong.me"
  value       = module.route53.nameservers
}
