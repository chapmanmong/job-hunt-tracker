output "db_password" {
  value = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["POSTGRES_PASSWORD"]
}

output "db_password_arn" {
  value = data.aws_secretsmanager_secret_version.db_password.arn
}
