const app = require('./api/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 API LocalStack rodando na porta ${PORT}`);
  console.log(`📊 Métricas disponíveis em: http://localhost:${PORT}/metrics`);
  console.log(`🏥 Health check em: http://localhost:${PORT}/health`);
});
