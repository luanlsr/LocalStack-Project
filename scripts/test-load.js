const axios = require('axios');
const fs = require('fs');

// Configuração
const BASE_URL = 'http://localhost:3000';
const LOAD_RESULTS_FILE = 'load-test-results.json';

// Cores para console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Classe de testes de carga
class LoadTests {
  constructor() {
    this.results = {
      startTime: null,
      endTime: null,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: [],
      scenarios: []
    };
    this.authToken = null;
  }

  // Obter token de autenticação
  async getAuthToken() {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        user: 'admin',
        password: '123'
      });
      this.authToken = response.data.token;
      return true;
    } catch (error) {
      log('❌ Falha ao obter token de autenticação', 'red');
      return false;
    }
  }

  // Medir tempo de resposta
  async measureResponseTime(requestFn) {
    const start = Date.now();
    try {
      const result = await requestFn();
      const responseTime = Date.now() - start;
      this.results.responseTimes.push(responseTime);
      this.results.totalRequests++;
      this.results.successfulRequests++;
      return { success: true, responseTime, result };
    } catch (error) {
      const responseTime = Date.now() - start;
      this.results.responseTimes.push(responseTime);
      this.results.totalRequests++;
      this.results.failedRequests++;
      this.results.errors.push({
        timestamp: new Date().toISOString(),
        error: error.message,
        responseTime
      });
      return { success: false, responseTime, error: error.message };
    }
  }

  // Cenário 1: Carga baixa (10 requests simultâneos)
  async lowLoadScenario() {
    log('\n📊 Cenário 1: Carga Baixa (10 requests simultâneos)', 'cyan');
    
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(this.measureResponseTime(async () => {
        return await axios.get(`${BASE_URL}/health`);
      }));
    }

    const results = await Promise.all(requests);
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    this.results.scenarios.push({
      name: 'Carga Baixa',
      concurrentRequests: 10,
      successfulRequests: successCount,
      failedRequests: 10 - successCount,
      averageResponseTime: avgResponseTime,
      successRate: (successCount / 10) * 100
    });

    log(`✅ Sucessos: ${successCount}/10 (${(successCount/10*100).toFixed(1)}%)`, 'green');
    log(`⏱️  Tempo médio: ${avgResponseTime.toFixed(0)}ms`, 'blue');
  }

  // Cenário 2: Carga média (50 requests simultâneos)
  async mediumLoadScenario() {
    log('\n📊 Cenário 2: Carga Média (50 requests simultâneos)', 'cyan');
    
    const requests = [];
    for (let i = 0; i < 50; i++) {
      requests.push(this.measureResponseTime(async () => {
        return await axios.get(`${BASE_URL}/health`);
      }));
    }

    const results = await Promise.all(requests);
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    this.results.scenarios.push({
      name: 'Carga Média',
      concurrentRequests: 50,
      successfulRequests: successCount,
      failedRequests: 50 - successCount,
      averageResponseTime: avgResponseTime,
      successRate: (successCount / 50) * 100
    });

    log(`✅ Sucessos: ${successCount}/50 (${(successCount/50*100).toFixed(1)}%)`, 'green');
    log(`⏱️  Tempo médio: ${avgResponseTime.toFixed(0)}ms`, 'blue');
  }

  // Cenário 3: Carga alta (100 requests simultâneos)
  async highLoadScenario() {
    log('\n📊 Cenário 3: Carga Alta (100 requests simultâneos)', 'cyan');
    
    const requests = [];
    for (let i = 0; i < 100; i++) {
      requests.push(this.measureResponseTime(async () => {
        return await axios.get(`${BASE_URL}/health`);
      }));
    }

    const results = await Promise.all(requests);
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    this.results.scenarios.push({
      name: 'Carga Alta',
      concurrentRequests: 100,
      successfulRequests: successCount,
      failedRequests: 100 - successCount,
      averageResponseTime: avgResponseTime,
      successRate: (successCount / 100) * 100
    });

    log(`✅ Sucessos: ${successCount}/100 (${(successCount/100*100).toFixed(1)}%)`, 'green');
    log(`⏱️  Tempo médio: ${avgResponseTime.toFixed(0)}ms`, 'blue');
  }

  // Cenário 4: Teste de stress com endpoints protegidos
  async stressTestScenario() {
    if (!this.authToken) {
      log('❌ Token não disponível para teste de stress', 'red');
      return;
    }

    log('\n📊 Cenário 4: Teste de Stress (50 requests protegidos)', 'cyan');
    
    const requests = [];
    for (let i = 0; i < 50; i++) {
      requests.push(this.measureResponseTime(async () => {
        const endpoint = i % 3 === 0 ? 'sqs/send' : 
                        i % 3 === 1 ? 's3/upload' : 'dynamodb/item';
        
        const data = endpoint === 'sqs/send' ? { message: `Stress test ${i}` } :
                    endpoint === 's3/upload' ? { 
                      key: `stress-${i}.json`, 
                      content: JSON.stringify({ test: i }) 
                    } :
                    { 
                      id: `stress-${i}`, 
                      name: `Stress Item ${i}`,
                      description: 'Stress test item'
                    };

        return await axios.post(`${BASE_URL}/${endpoint}`, data, {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
      }));
    }

    const results = await Promise.all(requests);
    const successCount = results.filter(r => r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    this.results.scenarios.push({
      name: 'Teste de Stress',
      concurrentRequests: 50,
      successfulRequests: successCount,
      failedRequests: 50 - successCount,
      averageResponseTime: avgResponseTime,
      successRate: (successCount / 50) * 100
    });

    log(`✅ Sucessos: ${successCount}/50 (${(successCount/50*100).toFixed(1)}%)`, 'green');
    log(`⏱️  Tempo médio: ${avgResponseTime.toFixed(0)}ms`, 'blue');
  }

  // Cenário 5: Teste de resistência (requests contínuos por 30 segundos)
  async enduranceTestScenario() {
    log('\n📊 Cenário 5: Teste de Resistência (30 segundos)', 'cyan');
    
    const startTime = Date.now();
    const duration = 30000; // 30 segundos
    let requestCount = 0;
    let successCount = 0;
    const responseTimes = [];

    while (Date.now() - startTime < duration) {
      const start = Date.now();
      try {
        await axios.get(`${BASE_URL}/health`);
        const responseTime = Date.now() - start;
        responseTimes.push(responseTime);
        successCount++;
      } catch (error) {
        const responseTime = Date.now() - start;
        responseTimes.push(responseTime);
        this.results.errors.push({
          timestamp: new Date().toISOString(),
          error: error.message,
          responseTime
        });
      }
      requestCount++;
      this.results.totalRequests++;
      
      // Pequena pausa para não sobrecarregar
      await sleep(100);
    }

    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    this.results.scenarios.push({
      name: 'Teste de Resistência',
      concurrentRequests: 'Contínuo',
      successfulRequests: successCount,
      failedRequests: requestCount - successCount,
      averageResponseTime: avgResponseTime,
      successRate: (successCount / requestCount) * 100,
      duration: '30 segundos',
      totalRequests: requestCount
    });

    log(`✅ Sucessos: ${successCount}/${requestCount} (${(successCount/requestCount*100).toFixed(1)}%)`, 'green');
    log(`⏱️  Tempo médio: ${avgResponseTime.toFixed(0)}ms`, 'blue');
    log(`📈 Requests por segundo: ${(requestCount/30).toFixed(1)}`, 'cyan');
  }

  // Calcular estatísticas
  calculateStats() {
    const responseTimes = this.results.responseTimes;
    if (responseTimes.length === 0) return null;

    const sorted = responseTimes.sort((a, b) => a - b);
    const avg = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    const totalRequests = this.results.scenarios.reduce((sum, s) => sum + (s.totalRequests || s.concurrentRequests), 0);
    const successfulRequests = this.results.scenarios.reduce((sum, s) => sum + s.successfulRequests, 0);
    const successRate = (successfulRequests / totalRequests) * 100;

    return {
      average: avg,
      min,
      max,
      median,
      p95,
      p99,
      totalRequests: totalRequests,
      successRate: successRate
    };
  }

  // Salvar resultados
  saveResults() {
    try {
      const stats = this.calculateStats();
      const finalResults = {
        ...this.results,
        endTime: new Date().toISOString(),
        duration: this.results.endTime ? 
          new Date(this.results.endTime) - new Date(this.results.startTime) : null,
        statistics: stats
      };

      fs.writeFileSync(LOAD_RESULTS_FILE, JSON.stringify(finalResults, null, 2));
      log(`\n📄 Resultados salvos em: ${LOAD_RESULTS_FILE}`, 'blue');
    } catch (error) {
      log(`\n❌ Erro ao salvar resultados: ${error.message}`, 'red');
    }
  }

  // Imprimir resumo final
  printSummary() {
    const stats = this.calculateStats();
    if (!stats) {
      log('\n❌ Nenhum resultado para exibir', 'red');
      return;
    }

    log('\n============================================================', 'blue');
    log('📊 RESUMO DOS TESTES DE CARGA', 'bold');
    log('============================================================', 'blue');

    log(`\n📈 Estatísticas Gerais:`, 'cyan');
    log(`Total de Requests: ${stats.totalRequests}`, 'blue');
    log(`Taxa de Sucesso: ${stats.successRate.toFixed(1)}%`, stats.successRate >= 95 ? 'green' : 'yellow');
    log(`Requests por Segundo: ${(stats.totalRequests / ((Date.now() - new Date(this.results.startTime)) / 1000)).toFixed(1)}`, 'blue');

    log(`\n⏱️  Tempos de Resposta:`, 'cyan');
    log(`Mínimo: ${stats.min}ms`, 'blue');
    log(`Máximo: ${stats.max}ms`, 'blue');
    log(`Médio: ${stats.average.toFixed(0)}ms`, 'blue');
    log(`Mediana: ${stats.median}ms`, 'blue');
    log(`95º Percentil: ${stats.p95}ms`, 'blue');
    log(`99º Percentil: ${stats.p99}ms`, 'blue');

    log(`\n📊 Cenários Executados:`, 'cyan');
    this.results.scenarios.forEach(scenario => {
      const status = scenario.successRate >= 95 ? 'green' : scenario.successRate >= 80 ? 'yellow' : 'red';
      log(`${scenario.name}:`, 'blue');
      log(`  Sucessos: ${scenario.successfulRequests}/${scenario.concurrentRequests} (${scenario.successRate.toFixed(1)}%)`, status);
      log(`  Tempo médio: ${scenario.averageResponseTime.toFixed(0)}ms`, 'blue');
    });

    if (this.results.errors.length > 0) {
      log(`\n❌ Erros Encontrados: ${this.results.errors.length}`, 'red');
      this.results.errors.slice(0, 5).forEach(error => {
        log(`  - ${error.error}`, 'red');
      });
      if (this.results.errors.length > 5) {
        log(`  ... e mais ${this.results.errors.length - 5} erros`, 'red');
      }
    }

    log('\n🎯 Avaliação de Performance:', stats.successRate >= 95 && stats.average < 1000 ? 'green' : 'yellow');
    if (stats.successRate >= 95 && stats.average < 1000) {
      log('✅ EXCELENTE - Sistema está performando muito bem!', 'green');
    } else if (stats.successRate >= 95 && stats.average < 1500) {
      log('🟢 MUITO BOM - Sistema está performando bem!', 'cyan');
    } else if (stats.successRate >= 80 && stats.average < 2000) {
      log('⚠️  BOM - Sistema está aceitável, mas pode ser otimizado', 'yellow');
    } else {
      log('❌ RUIM - Sistema precisa de otimização', 'red');
    }
  }

  // Executar todos os cenários
  async runAllScenarios() {
    log('\n🚀 Iniciando Testes de Carga...', 'bold');
    log('============================================================', 'blue');

    this.results.startTime = new Date().toISOString();

    // Obter token de autenticação
    if (!(await this.getAuthToken())) {
      log('❌ Falha na autenticação. Abortando testes.', 'red');
      return;
    }

    // Executar cenários
    await this.lowLoadScenario();
    await sleep(2000);

    await this.mediumLoadScenario();
    await sleep(2000);

    await this.highLoadScenario();
    await sleep(2000);

    await this.stressTestScenario();
    await sleep(2000);

    await this.enduranceTestScenario();

    this.results.endTime = new Date().toISOString();

    // Salvar e exibir resultados
    this.saveResults();
    this.printSummary();
  }
}

// Executar testes
async function main() {
  const loadTests = new LoadTests();
  
  try {
    await loadTests.runAllScenarios();
  } catch (error) {
    log(`\n💥 Erro fatal durante os testes de carga: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = LoadTests; 
