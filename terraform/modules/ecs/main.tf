resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.app_name}-${var.environment}-cluster"
}
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "${var.app_name}-${var.environment}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = module.iam.ecs_execution_role.arn
  task_role_arn      = module.iam.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${var.ecr_repo_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        {
          name  = "DB_HOST"
          value = var.db_host
        },
        {
          name  = "DB_PORT"
          value = var.db_port
        },
        {
          name  = "DB_NAME"
          value = var.db_name
        },
        {
          name  = "DB_USERNAME"
          value = var.db_username
        },
        {
          name      = "DB_PASSWORD"
          valueFrom = module.secrets.db_secret_arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = module.secrets.jwt_secret_arn
        }
      ]
    }
  ])
}
