# 1. Required Terraform Version & Provider Requirements
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# 2. AWS Provider Configuration
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Expense-Tracker"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 3. Amazon ECR Repository Resource
resource "aws_ecr_repository" "expense_backend" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = var.ecr_repository_name
  }
}
