const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para verificar se o servidor está funcionando
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Test Dashboard'
    });
});

// Rota para executar testes via API (opcional)
app.post('/api/run-test', async (req, res) => {
    try {
        const { testType, testId } = req.body;
        
        // Aqui você pode integrar com os scripts de teste existentes
        res.json({ 
            success: true, 
            message: `Teste ${testId} iniciado`,
            testType 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Dashboard de Testes rodando em: http://localhost:${PORT}`);
    console.log(`📊 Acesse: http://localhost:${PORT}`);
    console.log(`🔧 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app; 
