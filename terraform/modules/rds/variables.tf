variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "private_subnet_id" {
  description = ""
  type        = string
}

variable "vpc_id" {
  description = ""
  type        = string
}

variable "db_password" {
  type = string
}
