const express = require('express');
const router = express.Router();
const { dynamodb, TABLE_NAME, withRetry } = require('../services/aws');
const authenticateJWT = require('../middlewares/authenticateJWT');
const { toDynamoItem } = require('../utils/conversor');

router.post('/item', authenticateJWT, async (req, res) => {
  const item = req.body;
  if (!item.id) return res.status(400).send({ error: 'id é obrigatório no item' });

  const params = {
    TableName: TABLE_NAME,
    Item: toDynamoItem(item),
  };

  try {
    const putWithRetry = withRetry(dynamodb.putItem.bind(dynamodb));
    await putWithRetry(params);
    res.send({ message: 'Item inserido com sucesso no DynamoDB!', item });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get('/item/:id', authenticateJWT, async (req, res) => {
  const id = req.params.id;

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    const getWithRetry = withRetry(dynamodb.getItem.bind(dynamodb));
    const data = await getWithRetry(params);
    if (!data.Item) return res.status(404).send({ error: 'Item não encontrado' });
    res.send({ message: 'Item encontrado no DynamoDB!', item: data.Item });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router; 
