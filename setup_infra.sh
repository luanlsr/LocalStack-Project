#!/bin/bash

# Endpoint do LocalStack
ENDPOINT="http://localhost:4566"
REGION="us-east-1"

echo "🚀 Criando Bucket S3..."
aws --endpoint-url=$ENDPOINT s3 mb s3://meu-bucket-local

echo "📨 Criando fila SQS..."
aws --endpoint-url=$ENDPOINT sqs create-queue --queue-name minha-fila

echo "🗃️ Criando tabela DynamoDB..."
aws --endpoint-url=$ENDPOINT dynamodb create-table \
  --table-name Tarefas \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION

echo "✅ Infraestrutura local criada com sucesso!"
