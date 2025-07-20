const client = require('prom-client');

const register = new client.Registry();

const localstackHealthGauge = new client.Gauge({
  name: 'localstack_health_status',
  help: 'Status de saúde do LocalStack (1 = saudável, 0 = não saudável)',
  registers: [register]
});

const serviceHealthGauge = new client.Gauge({
  name: 'aws_service_health_status',
  help: 'Status de saúde dos serviços AWS (1 = saudável, 0 = não saudável)',
  labelNames: ['service'],
  registers: [register]
});

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

function registerPrometheusMetrics(app) {
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
}

module.exports = {
  register,
  localstackHealthGauge,
  serviceHealthGauge,
  registerPrometheusMetrics
}; 
