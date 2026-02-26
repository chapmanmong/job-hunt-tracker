output "ecs_execution_role_arn" {
  description = "ARN of the ECS execution role (needed for ECS task definition)"
  value       = aws_iam_role.ecs_execution_role.arn
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS task role (needed for ECS task definition)"
  value       = aws_iam_role.ecs_task_role.arn
}
