output "ecr_repository_url" {
  description = "The URL of the ECR repository (use this to tag and push Docker images)"
  value       = aws_ecr_repository.expense_backend.repository_url
}

output "ecr_repository_arn" {
  description = "The Amazon Resource Name (ARN) of the ECR repository"
  value       = aws_ecr_repository.expense_backend.arn
}
