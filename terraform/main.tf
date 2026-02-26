module "route53" {
  source      = "./modules/route53"
  domain_name = var.domain_name
  subdomain   = var.subdomain
}

resource "aws_vpc" "jh_tracker_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-vpc"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id            = aws_vpc.jh_tracker_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-2a"
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-public-subnet"
  }
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private_subnet" {
  vpc_id     = aws_vpc.jh_tracker_vpc.id
  cidr_block = "10.0.2.0/24"
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-private-subnet"
  }
  availability_zone = "ap-southeast-2a"
}

module "igw" {
  source           = "./modules/igw"
  environment      = var.environment
  app_name         = var.app_name
  vpc_id           = aws_vpc.jh_tracker_vpc.id
  public_subnet_id = aws_subnet.public_subnet.id
}



module "rds" {
  source            = "./modules/rds"
  app_name          = var.app_name
  environment       = var.environment
  vpc_id            = aws_vpc.jh_tracker_vpc.id
  private_subnet_id = aws_subnet.private_subnet.id
  public_subnet_id  = aws_subnet.public_subnet.id
}

module "ecr" {
  source   = "./modules/ecr"
  app_name = var.app_name
}

module "ecs" {
  source       = "./modules/ecs"
  app_name     = var.app_name
  environment  = var.environment
  db_username  = var.db_username
  db_name      = var.db_name
  db_host      = module.rds.db_host
  db_port      = module.rds.db_port
  ecr_repo_url = module.ecr.ecr_repo_url
}

module "iam" {
  source   = "./modules/iam"
  app_name = var.app_name
}

# module "alb" {
#   source      = "./modules/alb"
#   vpc_id      = module.vpc.vpc_id
#   app_name    = var.app_name
#   environment = var.environment
#   aws_region  = var.aws_region
# }

# module "s3" {
#   source       = "./modules/s3"
#   app_name     = var.app_name
#   environment  = var.environment
#   frontend_url = var.frontend_url
# }

# module "cloudfront" {
#   source              = "./modules/cloudfront"
#   s3_bucket_id        = module.s3.bucket_id
#   s3_bucket_arn       = module.s3.bucket_arn
#   acm_certificate_arn = module.cloudfront.acm_certificate_arn
#   domain_name         = var.frontend_url
#   aws_region          = var.aws_region
#   providers = {
#     aws.us_east_1 = aws.us_east_1
#   }
# }

