variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
}

variable "app_name" {
  description = "Name of the application"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnet_id" {
  description = "ID of the public subnet"
  type        = string
}
