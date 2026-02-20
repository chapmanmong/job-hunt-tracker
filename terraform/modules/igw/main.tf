resource "aws_internet_gateway" "igw" {
  vpc_id = var.vpc_id
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = var.vpc_id
  tags = {
    Environment = var.environment
    Name        = "${var.app_name}-${var.environment}-public-rt"
  }
}

resource "aws_route" "public_igw_route" {
  route_table_id         = aws_route_table.public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = var.public_subnet_id
  route_table_id = aws_route_table.public_rt.id
}
