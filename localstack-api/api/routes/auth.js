const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET = 'sua_chave_secreta';

router.post('/login', (req, res) => {
  const { user, password } = req.body;
  if (user === 'admin' && password === '123') {
    const token = jwt.sign({ user }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router; 
