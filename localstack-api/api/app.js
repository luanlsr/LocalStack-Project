const express = require('express');
const bodyParser = require('body-parser');
const { registerPrometheusMetrics } = require('./services/prometheus');
const { initializeServices } = require('./services/aws');

const authRoutes = require('./routes/auth');
const sqsRoutes = require('./routes/sqs');
const s3Routes = require('./routes/s3');
const dynamodbRoutes = require('./routes/dynamodb');
const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');

const app = express();
app.use(bodyParser.json());

registerPrometheusMetrics(app);
initializeServices();

app.use('/auth', authRoutes);
app.use('/sqs', sqsRoutes);
app.use('/s3', s3Routes);
app.use('/dynamodb', dynamodbRoutes);
app.use('/health', healthRoutes);
app.use('/metrics', metricsRoutes);

app.get('/', (req, res) => {
  res.send('API LocalStack rodando! Use /health para verificar o status dos serviços.');
});

module.exports = app; 
