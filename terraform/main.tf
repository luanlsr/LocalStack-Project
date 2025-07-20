provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  skip_region_validation      = true
  s3_use_path_style           = true

  endpoints {
    sqs      = "http://localhost:4566"
    s3       = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
  }
}

# Bucket S3
resource "aws_s3_bucket" "meu_bucket" {
  bucket = "meu-bucket-teste"
}

# Fila SQS
resource "aws_sqs_queue" "minha_fila" {
  name                       = "minha-fila"
  # Usar configurações simples para evitar timeout no LocalStack
  delay_seconds              = 0
  max_message_size           = 262144
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 0
  visibility_timeout_seconds = 30
}

# Tabela DynamoDB
resource "aws_dynamodb_table" "tarefas" {
  name         = "Tarefas"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
