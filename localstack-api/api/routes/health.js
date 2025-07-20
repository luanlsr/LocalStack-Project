const express = require('express');
const router = express.Router();
const { checkLocalStackHealth, checkS3Service, checkSQSService, checkDynamoDBService } = require('../services/aws');

router.get('/', async (req, res) => {
  try {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'checking',
      services: {}
    };

    // Verificar LocalStack
    try {
      await checkLocalStackHealth();
      healthStatus.services.localstack = { status: 'healthy' };
    } catch (error) {
      healthStatus.services.localstack = { status: 'unhealthy', error: error.message };
    }

    // Verificar S3
    try {
      await checkS3Service();
      healthStatus.services.s3 = { status: 'healthy' };
    } catch (error) {
      healthStatus.services.s3 = { status: 'unhealthy', error: error.message };
    }

    // Verificar SQS
    try {
      await checkSQSService();
      healthStatus.services.sqs = { status: 'healthy' };
    } catch (error) {
      healthStatus.services.sqs = { status: 'unhealthy', error: error.message };
    }

    // Verificar DynamoDB
    try {
      await checkDynamoDBService();
      healthStatus.services.dynamodb = { status: 'healthy' };
    } catch (error) {
      healthStatus.services.dynamodb = { status: 'unhealthy', error: error.message };
    }

    // Determinar status geral
    const allHealthy = Object.values(healthStatus.services).every(service => service.status === 'healthy');
    healthStatus.status = allHealthy ? 'healthy' : 'degraded';

    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (err) {
    res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: err.message
    });
  }
});

module.exports = router; 
