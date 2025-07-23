const axios = require('axios');
const fs = require('fs');

// Configuração
const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS_FILE = 'test-results.json';

// Cores para console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Utilitários
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Classe de testes
class IntegrationTests {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
    this.authToken = null;
  }

  // Registrar resultado do teste
  recordTest(name, success, details = {}) {
    this.results.total++;
    if (success) {
      this.results.passed++;
      log(`✅ ${name}`, 'green');
    } else {
      this.results.failed++;
      log(`❌ ${name}`, 'red');
    }
    
    this.results.tests.push({
      name,
      success,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Teste de conectividade básica
  async testHealthCheck() {
    try {
      const response = await axios.get(`${BASE_URL}/health`);
      const success = response.status === 200 && (response.data.status === 'OK' || response.data.status === 'healthy');
      this.recordTest('Health Check', success, {
        status: response.status,
        data: response.data
      });
      return success;
    } catch (error) {
      this.recordTest('Health Check', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste de autenticação
  async testAuthentication() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        user: 'admin',
        password: '123'
      });
      
      const success = response.status === 200 && response.data.token;
      if (success) {
        this.authToken = response.data.token;
      }
      
      this.recordTest('Authentication', success, {
        status: response.status,
        hasToken: !!response.data.token
      });
      return success;
    } catch (error) {
      this.recordTest('Authentication', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste SQS
  async testSQS() {
    if (!this.authToken) {
      this.recordTest('SQS Send Message', false, { error: 'No auth token' });
      return false;
    }

    try {
      const testMessage = {
        message: `Test message ${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(`${BASE_URL}/sqs/send`, testMessage, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      const success = response.status === 200 && response.data.messageId;
      this.recordTest('SQS Send Message', success, {
        status: response.status,
        messageId: response.data.messageId
      });
      return success;
    } catch (error) {
      this.recordTest('SQS Send Message', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste S3
  async testS3() {
    if (!this.authToken) {
      this.recordTest('S3 Upload', false, { error: 'No auth token' });
      return false;
    }

    try {
      const testData = {
        key: `test-${Date.now()}.json`,
        content: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          data: 'Test file content'
        })
      };

      const response = await axios.post(`${BASE_URL}/s3/upload`, testData, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      const success = response.status === 200 && response.data.message;
      this.recordTest('S3 Upload', success, {
        status: response.status,
        location: response.data.location
      });
      return success;
    } catch (error) {
      this.recordTest('S3 Upload', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste DynamoDB
  async testDynamoDB() {
    if (!this.authToken) {
      this.recordTest('DynamoDB Insert', false, { error: 'No auth token' });
      return false;
    }

    try {
      const testItem = {
        id: `test-${Date.now()}`,
        name: 'Test Item',
        description: 'Integration test item',
        timestamp: new Date().toISOString(),
        active: true
      };

      const response = await axios.post(`${BASE_URL}/dynamodb/item`, testItem, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      const success = response.status === 200 && response.data.message;
      this.recordTest('DynamoDB Insert', success, {
        status: response.status,
        itemId: testItem.id
      });

      // Teste de recuperação
      if (success) {
        await this.testDynamoDBGet(testItem.id);
      }

      return success;
    } catch (error) {
      this.recordTest('DynamoDB Insert', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste de recuperação DynamoDB
  async testDynamoDBGet(itemId) {
    try {
      const response = await axios.get(`${BASE_URL}/dynamodb/item/${itemId}`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });

      const success = response.status === 200 && response.data.item;
      this.recordTest('DynamoDB Get', success, {
        status: response.status,
        itemId: itemId,
        response: response.data
      });
      return success;
    } catch (error) {
      this.recordTest('DynamoDB Get', false, {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return false;
    }
  }

  // Teste de métricas
  async testMetrics() {
    try {
      const response = await axios.get(`${BASE_URL}/metrics`);
      const success = response.status === 200 && (response.data.includes('http_requests_total') || response.data.includes('process_'));
      this.recordTest('Prometheus Metrics', success, {
        status: response.status,
        hasMetrics: response.data.includes('http_requests_total') || response.data.includes('process_'),
        dataLength: response.data.length
      });
      return success;
    } catch (error) {
      this.recordTest('Prometheus Metrics', false, {
        error: error.message
      });
      return false;
    }
  }

  // Teste de autenticação inválida
  async testInvalidAuth() {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        user: 'invalid',
        password: 'wrong'
      });
      this.recordTest('Invalid Authentication', false, {
        error: 'Should have failed with invalid credentials'
      });
      return false;
    } catch (error) {
      const success = error.response && error.response.status === 401;
      this.recordTest('Invalid Authentication', success, {
        status: error.response?.status
      });
      return success;
    }
  }

  // Teste de endpoint protegido sem token
  async testProtectedEndpointWithoutToken() {
    try {
      await axios.post(`${BASE_URL}/sqs/send`, { message: 'test' });
      this.recordTest('Protected Endpoint Without Token', false, {
        error: 'Should have failed without token'
      });
      return false;
    } catch (error) {
      const success = error.response && error.response.status === 401;
      this.recordTest('Protected Endpoint Without Token', success, {
        status: error.response?.status
      });
      return success;
    }
  }

  // Executar todos os testes
  async runAllTests() {
    log('\n🚀 Iniciando Testes de Integração...', 'bold');
    log('==================================================', 'blue');

    // Testes básicos
    await this.testHealthCheck();
    await sleep(500);

    // Testes de autenticação
    await this.testAuthentication();
    await sleep(500);
    await this.testInvalidAuth();
    await sleep(500);

    // Testes de endpoints protegidos
    await this.testProtectedEndpointWithoutToken();
    await sleep(500);

    // Testes de serviços AWS
    await this.testSQS();
    await sleep(1000);
    await this.testS3();
    await sleep(1000);
    await this.testDynamoDB();
    await sleep(500);

    // Testes de monitoramento
    await this.testMetrics();

    // Salvar resultados
    this.saveResults();
    this.printSummary();
  }

  // Salvar resultados em arquivo
  saveResults() {
    try {
      fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(this.results, null, 2));
      log(`\n📄 Resultados salvos em: ${TEST_RESULTS_FILE}`, 'blue');
    } catch (error) {
      log(`\n❌ Erro ao salvar resultados: ${error.message}`, 'red');
    }
  }

  // Imprimir resumo
  printSummary() {
    log('\n==================================================', 'blue');
    log('📊 RESUMO DOS TESTES', 'bold');
    log('==================================================', 'blue');
    
    log(`Total de Testes: ${this.results.total}`, 'blue');
    log(`✅ Passaram: ${this.results.passed}`, 'green');
    log(`❌ Falharam: ${this.results.failed}`, 'red');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    log(`📈 Taxa de Sucesso: ${successRate}%`, successRate >= 80 ? 'green' : 'yellow');

    if (this.results.failed > 0) {
      log('\n❌ Testes que falharam:', 'red');
      this.results.tests
        .filter(test => !test.success)
        .forEach(test => {
          log(`  - ${test.name}: ${test.error || 'Erro desconhecido'}`, 'red');
        });
    }

    log('\n🎯 Status Final:', this.results.failed === 0 ? 'green' : 'yellow');
    if (this.results.failed === 0) {
      log('✅ TODOS OS TESTES PASSARAM!', 'green');
    } else {
      log(`⚠️  ${this.results.failed} teste(s) falharam`, 'yellow');
    }
  }
}

// Executar testes
async function main() {
  const tests = new IntegrationTests();
  
  try {
    await tests.runAllTests();
  } catch (error) {
    log(`\n💥 Erro fatal durante os testes: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = IntegrationTests; 
