output "zone_id" {
  description = "The Route53 hosted zone ID"
  value       = aws_route53_zone.subdomain.zone_id
}

output "nameservers" {
  description = "The Route53 nameservers for the subdomain"
  value       = aws_route53_zone.subdomain.name_servers
}
