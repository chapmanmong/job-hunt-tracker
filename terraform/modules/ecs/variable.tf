variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "db_username" {
  description = "Username for the PostgreSQL database"
  type        = string
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
}

variable "db_host" {
  description = "Hostname of the PostgreSQL database"
  type        = string
}

variable "db_port" {
  description = "Port of the PostgreSQL database"
  type        = string
}

variable "ecr_repo_url" {
  description = "URL of ecr repo"
  type        = string
}

