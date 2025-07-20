const express = require('express');
const router = express.Router();
const { s3, BUCKET, withRetry } = require('../services/aws');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.post('/upload', authenticateJWT, async (req, res) => {
  const { key, content } = req.body;
  if (!key || !content) return res.status(400).send({ error: 'key e content são obrigatórios' });

  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: content,
  };

  console.log('S3 Upload - Params:', JSON.stringify(params, null, 2));
  console.log('S3 Client config:', s3.config);
  (async () => {
    try {
      const buckets = await s3.listBuckets().promise();
      console.log('Buckets:', buckets);
    } catch (error) {
      console.error('Erro ao listar buckets:', error);
    }
  })();

  try {
    const putObjectWithRetry = withRetry(s3.putObject.bind(s3));
    await putObjectWithRetry(params);
    res.send({ message: 'Arquivo enviado com sucesso para o S3!', key });
  } catch (err) {
    console.error('S3 Upload Error:', err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router; 
