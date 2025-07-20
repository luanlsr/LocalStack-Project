// testAWS.js
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test',
  endpoint: 'http://localstack:4566', // ou 'http://localstack:4566' se estiver rodando dentro do container
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

async function runTests() {
  // Inserir item no DynamoDB
  await dynamodb.put({
    TableName: 'Tarefas',
    Item: {
      id: 'tarefa-via-api',
      descricao: 'Tarefa enviada pela API',
    },
  }).promise();
  console.log('✅ Item inserido no DynamoDB');

  // Enviar mensagem para a fila
  await sqs.sendMessage({
    QueueUrl: 'http://localstack:4566/000000000000/minha-fila',
    MessageBody: 'Mensagem enviada pela API',
  }).promise();
  console.log('✅ Mensagem enviada para SQS');
}

runTests().catch(console.error);
