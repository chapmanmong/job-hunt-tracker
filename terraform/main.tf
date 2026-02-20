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



# module "rds" {
#   source      = "./modules/rds"
#   vpc_id      = module.vpc.vpc_id
#   db_name     = var.db_name
#   db_username = var.db_username
#   #db password will come from Secrets Manager
#   app_name    = var.app_name
#   environment = var.environment
#   aws_region  = var.aws_region
# }

# module "ecr" {
#   source      = "./modules/ecr"
#   app_name    = var.app_name
#   environment = var.environment
#   aws_region  = var.aws_region
# }

# module "ecs" {
#   source         = "./modules/ecr"
#   vpc_id         = module.vpc.vpc_id
#   cluster_name   = "${var.app_name}-${var.environment}-cluster"
#   app_name       = var.app_name
#   environment    = var.environment
#   aws_region     = var.aws_region
#   ecr_repo_url   = module.ecr.repository_url
#   db_secret_arn  = module.secrets.db_secret_arn
#   jwt_secret_arn = module.secrets.jwt_secret_arn
# }

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

# module "secrets" {
#   source      = "./modules/secrets"
#   app_name    = var.app_name
#   environment = var.environment
#   db_username = var.db_username
#   db_name     = var.db_name
#   # db_password and jwt_secret will be created here
# }

