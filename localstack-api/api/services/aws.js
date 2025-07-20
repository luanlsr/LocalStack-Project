const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://localstack:4566',
  accessKeyId: 'test',
  secretAccessKey: 'test',
  s3ForcePathStyle: true,
  s3DisableSSL: true,
  signatureVersion: 'v4'
});

const s3 = new AWS.S3({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
  s3ForcePathStyle: true,   // ESSENCIAL para evitar virtual-host style
  sslEnabled: false,        // opcional para LocalStack
  signatureVersion: 'v4'
});

const sqs = new AWS.SQS({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test'
});

const dynamodb = new AWS.DynamoDB({
  endpoint: 'http://localstack:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test'
});

const BUCKET = 'meu-bucket-teste';
const QUEUE_URL = 'http://localstack:4566/000000000000/minha-fila';
const TABLE_NAME = 'Tarefas';

// Funções de health check
const checkS3Service = async () => {
  await s3.listBuckets().promise();
};

const checkSQSService = async () => {
  await sqs.listQueues().promise();
};

const checkDynamoDBService = async () => {
  await dynamodb.listTables().promise();
};

// Função para health do LocalStack
const checkLocalStackHealth = async () => {
  const http = require('http');
  return new Promise((resolve, reject) => {
    const req = http.get('http://localstack:4566/_localstack/health', (res) => {
      if (res.statusCode === 200) resolve();
      else reject(new Error(`LocalStack health check failed: ${res.statusCode}`));
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('LocalStack health check timeout'));
    });
  });
};

// Função de retry
const withRetry = (operation, maxRetries = 3) => {
  return async (...args) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation(...args).promise();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.log(`Tentativa ${attempt} falhou, tentando novamente em 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
};

// Inicialização robusta dos serviços
const initializeServices = async () => {
  console.log('🚀 Iniciando verificação de conectividade com LocalStack...');
  try {
    await checkLocalStackHealth();
    await checkS3Service();
    await checkSQSService();
    await checkDynamoDBService();
    console.log('✅ Inicialização dos serviços concluída!');
  } catch (err) {
    console.warn('⚠️ Algum serviço não está pronto:', err.message);
  }
};

module.exports = {
  s3,
  sqs,
  dynamodb,
  BUCKET,
  QUEUE_URL,
  TABLE_NAME,
  withRetry,
  initializeServices,
  checkS3Service,
  checkSQSService,
  checkDynamoDBService,
  checkLocalStackHealth
}; 
