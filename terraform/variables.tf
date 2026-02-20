variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-2"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "job-hunt-tracker"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "chapmanmong.me"
}

variable "subdomain" {
  description = "Subdomain for the application"
  type        = string
  default     = "jh"
}

variable "frontend_url" {
  description = "URL for the frontend application"
  type        = string
  default     = "jh.chapmanmong.me"
}

variable "backend_url" {
  description = "URL for the backend API"
  type        = string
  default     = "api.jh.chapmanmong.me"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "jobtracker"
}

variable "db_username" {
  description = "Username for the PostgreSQL database"
  type        = string
  default     = "jobtracker"
}
