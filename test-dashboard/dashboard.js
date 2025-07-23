// Configurações da API
const API_BASE_URL = 'http://localhost:3000';

// Estado global dos testes
let testResults = [];
let isRunning = false;
let authToken = null;
let testStats = { total: 0, passed: 0, failed: 0 };
let currentTestSuite = null;

// Definição dos testes de integração
const integrationTests = [
    {
        id: 'health',
        name: 'Health Check',
        description: 'Verifica se a API está funcionando',
        icon: 'fas fa-heartbeat',
        endpoint: '/health'
    },
    {
        id: 'auth',
        name: 'Autenticação',
        description: 'Testa o sistema de autenticação JWT',
        icon: 'fas fa-key',
        endpoint: '/auth/login'
    },
    {
        id: 'auth-invalid',
        name: 'Autenticação Inválida',
        description: 'Testa rejeição de credenciais inválidas',
        icon: 'fas fa-ban',
        endpoint: '/auth/login'
    },
    {
        id: 'protected',
        name: 'Endpoint Protegido',
        description: 'Testa acesso sem token',
        icon: 'fas fa-shield-alt',
        endpoint: '/sqs/send'
    },
    {
        id: 'sqs',
        name: 'SQS Send',
        description: 'Testa envio de mensagem para fila',
        icon: 'fas fa-envelope',
        endpoint: '/sqs/send'
    },
    {
        id: 's3',
        name: 'S3 Upload',
        description: 'Testa upload de arquivo para S3',
        icon: 'fas fa-cloud-upload-alt',
        endpoint: '/s3/upload'
    },
    {
        id: 'dynamodb-insert',
        name: 'DynamoDB Insert',
        description: 'Testa inserção de item no DynamoDB',
        icon: 'fas fa-database',
        endpoint: '/dynamodb/item'
    },
    {
        id: 'dynamodb-get',
        name: 'DynamoDB Get',
        description: 'Testa recuperação de item do DynamoDB',
        icon: 'fas fa-search',
        endpoint: '/dynamodb/item'
    },
    {
        id: 'metrics',
        name: 'Prometheus Metrics',
        description: 'Testa coleta de métricas',
        icon: 'fas fa-chart-line',
        endpoint: '/metrics'
    }
];

// Definição dos testes de carga
const loadTests = [
    {
        id: 'low',
        name: 'Carga Baixa',
        description: '10 requisições simultâneas',
        icon: 'fas fa-tachometer-alt',
        requests: 10,
        concurrency: 2
    },
    {
        id: 'medium',
        name: 'Carga Média',
        description: '50 requisições simultâneas',
        icon: 'fas fa-tachometer-alt',
        requests: 50,
        concurrency: 5
    },
    {
        id: 'high',
        name: 'Carga Alta',
        description: '100 requisições simultâneas',
        icon: 'fas fa-tachometer-alt',
        requests: 100,
        concurrency: 10
    },
    {
        id: 'stress',
        name: 'Teste de Stress',
        description: '200 requisições simultâneas',
        icon: 'fas fa-fire',
        requests: 200,
        concurrency: 20
    }
];

// Inicialização do dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadTestHistory();
});

function initializeDashboard() {
    renderIntegrationTests();
    renderLoadTests();
    updateResultsSection();
}

function renderIntegrationTests() {
    const container = document.getElementById('integration-tests');
    container.innerHTML = '';

    integrationTests.forEach(test => {
        const card = createTestCard(test, 'integration');
        container.appendChild(card);
    });
}

function renderLoadTests() {
    const container = document.getElementById('load-tests');
    container.innerHTML = '';

    loadTests.forEach(test => {
        const card = createTestCard(test, 'load');
        container.appendChild(card);
    });
}

function createTestCard(test, type) {
    const card = document.createElement('div');
    card.className = 'test-card';
    card.id = `test-${test.id}`;

    const description = type === 'load' ? 
        `${test.description} (${test.requests} requests)` : 
        test.description;

    card.innerHTML = `
        <div class="test-header">
            <div class="test-name">
                <i class="${test.icon}"></i>
                ${test.name}
            </div>
            <div class="test-status status-pending" id="status-${test.id}">
                Pendente
            </div>
        </div>
        <div class="test-details">
            ${description}
        </div>
        <div class="test-actions">
            <button class="btn btn-primary" onclick="runSingleTest('${test.id}', '${type}')">
                <i class="fas fa-play"></i> Executar
            </button>
        </div>
    `;

    return card;
}

// Funções de execução de testes
async function runIntegrationTests() {
    if (isRunning) {
        log('⚠️ Testes já estão em execução!');
        return;
    }

    isRunning = true;
    currentTestSuite = 'integration';
    resetAllTests();
    showResultsSection();
    
    log('🚀 Iniciando Testes de Integração...');
    log('==================================================');

    testStats = { total: integrationTests.length, passed: 0, failed: 0 };
    
    for (let i = 0; i < integrationTests.length; i++) {
        const test = integrationTests[i];
        await runSingleTest(test.id, 'integration', false);
        updateProgress(((i + 1) / integrationTests.length) * 100);
        await sleep(500);
    }

    updateResultsSummary(testStats.passed, testStats.failed, testStats.total);
    log('==================================================');
    log(`✅ Testes concluídos: ${testStats.passed}/${testStats.total} passaram`);
    
    isRunning = false;
}

async function runSingleTest(testId, type = 'integration', showResults = true) {
    if (isRunning && currentTestSuite !== type) {
        log(`⚠️ Aguarde a conclusão dos testes de ${currentTestSuite}`);
        return;
    }

    if (showResults) {
        showResultsSection();
        isRunning = true;
    }

    const test = type === 'integration' ? 
        integrationTests.find(t => t.id === testId) : 
        loadTests.find(t => t.id === testId);

    if (!test) {
        log(`❌ Teste não encontrado: ${testId}`);
        return;
    }

    updateTestStatus(testId, 'running');
    log(`🔄 Executando: ${test.name}...`);

    try {
        let result;
        if (type === 'integration') {
            result = await executeIntegrationTest(test);
        } else {
            result = await executeLoadTest(test);
        }

        const success = result.success;
        updateTestStatus(testId, success ? 'success' : 'error');
        
        if (success) {
            log(`✅ ${test.name} - PASSOU`);
            if (showResults) testStats.passed++;
        } else {
            log(`❌ ${test.name} - FALHOU: ${result.error || 'Erro desconhecido'}`);
            if (showResults) testStats.failed++;
        }

        if (result.details) {
            log(`   Detalhes: ${JSON.stringify(result.details)}`);
        }

        testResults.push({
            testId,
            name: test.name,
            type,
            success,
            timestamp: new Date().toISOString(),
            ...result
        });

        if (showResults) {
            updateResultsSummary(testStats.passed, testStats.failed, testStats.passed + testStats.failed);
        }

    } catch (error) {
        updateTestStatus(testId, 'error');
        log(`❌ ${test.name} - ERRO: ${error.message}`);
        if (showResults) testStats.failed++;
    }

    if (showResults) {
        isRunning = false;
    }
}

async function executeIntegrationTest(test) {
    const startTime = Date.now();
    
    try {
        switch (test.id) {
            case 'health':
                return await testHealthCheck();
            case 'auth':
                return await testAuthentication();
            case 'auth-invalid':
                return await testInvalidAuth();
            case 'protected':
                return await testProtectedEndpoint();
            case 'sqs':
                return await testSQS();
            case 's3':
                return await testS3();
            case 'dynamodb-insert':
                return await testDynamoDBInsert();
            case 'dynamodb-get':
                return await testDynamoDBGet();
            case 'metrics':
                return await testMetrics();
            default:
                throw new Error(`Teste não implementado: ${test.id}`);
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            duration: Date.now() - startTime
        };
    }
}

// Implementação dos testes individuais
async function testHealthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    return {
        success: response.ok && (data.status === 'OK' || data.status === 'healthy'),
        details: { status: response.status, data }
    };
}

async function testAuthentication() {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'admin', password: '123' })
    });
    
    const data = await response.json();
    const success = response.ok && data.token;
    
    if (success) {
        authToken = data.token;
    }
    
    return {
        success,
        details: { status: response.status, hasToken: !!data.token }
    };
}

async function testInvalidAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'invalid', password: 'wrong' })
        });
        
        // Deve falhar com 401
        return {
            success: response.status === 401,
            details: { status: response.status }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function testProtectedEndpoint() {
    try {
        const response = await fetch(`${API_BASE_URL}/sqs/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'test' })
        });
        
        // Deve falhar com 401 (sem token)
        return {
            success: response.status === 401,
            details: { status: response.status }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function testSQS() {
    if (!authToken) {
        // Tentar autenticar primeiro
        const authResult = await testAuthentication();
        if (!authResult.success) {
            return { success: false, error: 'Falha na autenticação' };
        }
    }
    
    const testMessage = {
        message: `Mensagem de teste ${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/sqs/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(testMessage)
    });
    
    const data = await response.json();
    
    return {
        success: response.ok && data.messageId,
        details: { status: response.status, messageId: data.messageId }
    };
}

async function testS3() {
    if (!authToken) {
        const authResult = await testAuthentication();
        if (!authResult.success) {
            return { success: false, error: 'Falha na autenticação' };
        }
    }
    
    const testData = {
        key: `teste-${Date.now()}.json`,
        content: JSON.stringify({
            teste: true,
            timestamp: new Date().toISOString(),
            dados: 'Conteúdo do arquivo de teste'
        })
    };
    
    const response = await fetch(`${API_BASE_URL}/s3/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    return {
        success: response.ok && data.message,
        details: { status: response.status, location: data.location }
    };
}

async function testDynamoDBInsert() {
    if (!authToken) {
        const authResult = await testAuthentication();
        if (!authResult.success) {
            return { success: false, error: 'Falha na autenticação' };
        }
    }
    
    const testItem = {
        id: `teste-${Date.now()}`,
        titulo: 'Tarefa de Teste',
        descricao: 'Descrição da tarefa de teste',
        status: 'pendente',
        timestamp: new Date().toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/dynamodb/item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(testItem)
    });
    
    const data = await response.json();
    
    return {
        success: response.ok,
        details: { status: response.status, itemId: testItem.id }
    };
}

async function testDynamoDBGet() {
    if (!authToken) {
        const authResult = await testAuthentication();
        if (!authResult.success) {
            return { success: false, error: 'Falha na autenticação' };
        }
    }
    
    // Primeiro inserir um item para depois recuperar
    const insertResult = await testDynamoDBInsert();
    if (!insertResult.success) {
        return { success: false, error: 'Falha ao inserir item para teste' };
    }
    
    const itemId = insertResult.details.itemId;
    
    const response = await fetch(`${API_BASE_URL}/dynamodb/item/${itemId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    
    const data = await response.json();
    
    return {
        success: response.ok && data.id === itemId,
        details: { status: response.status, itemFound: !!data.id }
    };
}

async function testMetrics() {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    const data = await response.text();
    
    return {
        success: response.ok && data.length > 0,
        details: { status: response.status, dataLength: data.length }
    };
}

async function executeLoadTest(test) {
    log(`🚀 Iniciando teste de carga: ${test.name}`);
    log(`📊 Configuração: ${test.requests} requisições, ${test.concurrency} simultâneas`);
    
    if (!authToken) {
        const authResult = await testAuthentication();
        if (!authResult.success) {
            return { success: false, error: 'Falha na autenticação para teste de carga' };
        }
    }
    
    const startTime = Date.now();
    const results = [];
    const batches = Math.ceil(test.requests / test.concurrency);
    
    for (let batch = 0; batch < batches; batch++) {
        const batchStart = batch * test.concurrency;
        const batchEnd = Math.min(batchStart + test.concurrency, test.requests);
        const batchPromises = [];
        
        for (let i = batchStart; i < batchEnd; i++) {
            batchPromises.push(executeLoadRequest(i + 1, authToken));
        }
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Atualizar progresso
        const progress = ((batch + 1) / batches) * 100;
        updateProgress(progress);
        
        log(`📈 Lote ${batch + 1}/${batches} concluído (${batchResults.length} requisições)`);
        
        // Pequena pausa entre lotes
        if (batch < batches - 1) {
            await sleep(100);
        }
    }
    
    const totalTime = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    log(`📊 Resultado: ${successCount}/${test.requests} requisições bem-sucedidas`);
    log(`⏱️ Tempo total: ${formatDuration(totalTime)}`);
    log(`📈 Tempo médio de resposta: ${formatDuration(avgResponseTime)}`);
    
    return {
        success: successCount >= test.requests * 0.8, // 80% de sucesso
        details: {
            totalRequests: test.requests,
            successCount,
            failureCount: test.requests - successCount,
            totalTime,
            avgResponseTime,
            successRate: (successCount / test.requests * 100).toFixed(1)
        }
    };
}

async function executeLoadRequest(requestId, token) {
    const startTime = Date.now();
    
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        const duration = Date.now() - startTime;
        
        return {
            requestId,
            success: response.ok,
            status: response.status,
            duration
        };
    } catch (error) {
        return {
            requestId,
            success: false,
            error: error.message,
            duration: Date.now() - startTime
        };
    }
}

async function runLoadTest(testId) {
    const test = loadTests.find(t => t.id === testId);
    if (!test) return;
    
    return await runSingleTest(testId, 'load');
}

// Funções de UI
function updateTestStatus(testId, status) {
    const statusElement = document.getElementById(`status-${testId}`);
    const card = document.getElementById(`test-${testId}`);
    
    if (!statusElement || !card) return;
    
    // Remover classes anteriores
    card.className = 'test-card';
    statusElement.className = 'test-status';
    
    // Adicionar nova classe
    card.classList.add(status);
    statusElement.classList.add(`status-${status}`);
    
    // Atualizar texto
    const statusTexts = {
        'pending': 'Pendente',
        'running': '🔄 Executando...',
        'success': '✅ Sucesso',
        'error': '❌ Erro'
    };
    
    statusElement.innerHTML = statusTexts[status] || 'Pendente';
}

function resetAllTests() {
    integrationTests.forEach(test => {
        updateTestStatus(test.id, 'pending');
    });
    
    loadTests.forEach(test => {
        updateTestStatus(test.id, 'pending');
    });
    
    testStats = { total: 0, passed: 0, failed: 0 };
}

function showResultsSection() {
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('test-log').innerHTML = '';
    updateProgress(0);
}

function updateProgress(percentage) {
    document.getElementById('progress-fill').style.width = `${percentage}%`;
}

function log(message) {
    const logContainer = document.getElementById('test-log');
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    logContainer.innerHTML += `[${timestamp}] ${message}\n`;
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateResultsSummary(passed, failed, total) {
    const summaryContainer = document.getElementById('results-summary');
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    
    summaryContainer.innerHTML = `
        <div class="summary-card summary-total">
            <div class="summary-number">${total}</div>
            <div class="summary-label">Total de Testes</div>
        </div>
        <div class="summary-card summary-success">
            <div class="summary-number">${passed}</div>
            <div class="summary-label">Passaram</div>
        </div>
        <div class="summary-card summary-error">
            <div class="summary-number">${failed}</div>
            <div class="summary-label">Falharam</div>
        </div>
        <div class="summary-card summary-success">
            <div class="summary-number">${successRate}%</div>
            <div class="summary-label">Taxa de Sucesso</div>
        </div>
    `;
}

function updateResultsSection() {
    // Função para expandir com histórico de testes
}

function loadTestHistory() {
    // Função para carregar histórico de testes salvos
}

function downloadResults() {
    const logContent = document.getElementById('test-log').innerText;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados-testes-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Funções auxiliares
function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
