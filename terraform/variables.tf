variable "aws_region" {
  description = "The AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "ecr_repository_name" {
  description = "The name of the Amazon ECR repository for the backend image"
  type        = string
  default     = "expense-backend"
}

variable "environment" {
  description = "Deployment environment name (e.g. dev, staging, production)"
  type        = string
  default     = "production"
}
