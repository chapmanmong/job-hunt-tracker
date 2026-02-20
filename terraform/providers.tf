terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "job-hunt-tracker-tfstate"
    key            = "terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "job-hunt-tracker-tfstate-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ACM certificates for CloudFront MUST be created in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
