const express = require('express');
const router = express.Router();
const { register } = require('../services/prometheus');

router.get('/', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router; 
