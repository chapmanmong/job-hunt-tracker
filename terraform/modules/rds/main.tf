resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.app_name}-${var.environment}-rds-subnet-group"
  subnet_ids = [var.private_subnet_id]
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-rds-subnet-group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.app_name}-${var.environment}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_secretsmanager_secret" "db_password" {
  name = "${var.app_name}/${var.environment}/db_password"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = data.aws_secretsmanager_secret.db_password.id
}

locals {
  db_password = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["POSTGRES_PASSWORD"]
}

resource "aws_db_instance" "rds_instance" {
  allocated_storage      = 10
  db_name                = "${var.app_name}_${var.environment}_db"
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.micro"
  username               = "${var.app_name}_${var.environment}_admin"
  password               = local.db_password["POSTGRES_PASSWORD"]
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]


  publicly_accessible = false
}
