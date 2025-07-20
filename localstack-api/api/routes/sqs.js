const express = require('express');
const router = express.Router();
const { sqs, QUEUE_URL, withRetry } = require('../services/aws');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.post('/send', authenticateJWT, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: 'Mensagem é obrigatória' });

  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: message,
  };

  try {
    const sendMessageWithRetry = withRetry(sqs.sendMessage.bind(sqs));
    const data = await sendMessageWithRetry(params);
    res.send({
      message: 'Mensagem enviada com sucesso para a fila SQS!',
      messageId: data.MessageId
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router; 
