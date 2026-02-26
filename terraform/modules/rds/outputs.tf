output "db_host" {
  description = "Hostname of the PostgreSQL database"
  value       = aws_db_instance.rds_instance.address
}

output "db_port" {
  description = "Port of the PostgreSQL database"
  value       = aws_db_instance.rds_instance
}
