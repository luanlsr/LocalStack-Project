# 📂 Scripts de Teste e Automação

Este diretório contém scripts para testar e gerar tráfego na API LocalStack.

## 🚀 Scripts Disponíveis

### 📊 generate-traffic.js
Gera tráfego contínuo para popular métricas do Prometheus e testar endpoints.

**Como usar:**
```bash
# Instalar dependências
npm install

# Executar geração de tráfego
npm run generate-traffic
# ou
node generate-traffic.js
```

**Funcionalidades:**
- ✅ Gera requisições para todos os endpoints
- ✅ Simula usuários reais com autenticação JWT
- ✅ Popula métricas do Prometheus
- ✅ Executa em loop contínuo
- ✅ Logs coloridos e informativos

**Configuração:**
- Intervalo entre requisições: 2 segundos
- Endpoints testados: Health, Auth, SQS, S3, DynamoDB
- Credenciais: admin/123

### 🧪 test-integration.js
Executa testes de integração abrangentes para validar todos os endpoints da API.

**Como usar:**
```bash
# Executar testes de integração
npm run integration
# ou
node test-integration.js
```

**Funcionalidades:**
- ✅ Testa conectividade básica (Health Check)
- ✅ Valida autenticação JWT
- ✅ Testa todos os endpoints protegidos (SQS, S3, DynamoDB)
- ✅ Verifica métricas do Prometheus
- ✅ Testa cenários de erro (credenciais inválidas, sem token)
- ✅ Gera relatório detalhado em JSON
- ✅ Logs coloridos com status de cada teste

**Cobertura de Testes:**
- Health Check
- Autenticação válida e inválida
- Endpoints protegidos sem token
- SQS: Envio de mensagens
- S3: Upload de arquivos
- DynamoDB: Inserção e recuperação de dados
- Prometheus: Métricas disponíveis

### 📈 test-load.js
Executa testes de carga para simular tráfego intenso e medir performance.

**Como usar:**
```bash
# Executar testes de carga
npm run load
# ou
node test-load.js
```

**Funcionalidades:**
- ✅ 5 cenários de carga diferentes
- ✅ Medição de tempos de resposta
- ✅ Cálculo de percentis (95º, 99º)
- ✅ Teste de resistência (30 segundos)
- ✅ Análise de taxa de sucesso
- ✅ Relatório detalhado de performance
- ✅ Identificação de gargalos

**Cenários de Teste:**
1. **Carga Baixa**: 10 requests simultâneos
2. **Carga Média**: 50 requests simultâneos
3. **Carga Alta**: 100 requests simultâneos
4. **Teste de Stress**: 50 requests protegidos (SQS, S3, DynamoDB)
5. **Teste de Resistência**: Requests contínuos por 30 segundos

**Métricas Coletadas:**
- Tempo de resposta (mín, máx, médio, mediana)
- Percentis (95º, 99º)
- Taxa de sucesso
- Requests por segundo
- Erros e falhas

### 🎯 test:all
Executa todos os testes em sequência (integração + carga).

**Como usar:**
```bash
# Executar todos os testes
npm run test:all
```

## 📊 Resultados dos Testes

### Arquivos Gerados:
- `test-results.json` - Resultados dos testes de integração
- `load-test-results.json` - Resultados dos testes de carga

### Exemplo de Relatório de Integração:
```json
{
  "total": 8,
  "passed": 7,
  "failed": 1,
  "tests": [
    {
      "name": "Health Check",
      "success": true,
      "timestamp": "2024-01-01T12:00:00.000Z",
      "status": 200
    }
  ]
}
```

### Exemplo de Relatório de Carga:
```json
{
  "statistics": {
    "average": 245,
    "min": 120,
    "max": 890,
    "median": 230,
    "p95": 450,
    "p99": 650,
    "totalRequests": 210,
    "successRate": 98.5
  },
  "scenarios": [
    {
      "name": "Carga Baixa",
      "concurrentRequests": 10,
      "successfulRequests": 10,
      "successRate": 100
    }
  ]
}
```

## 🎯 Como Interpretar os Resultados

### ✅ Testes de Integração
- **Taxa de Sucesso ≥ 90%**: Sistema funcionando bem
- **Taxa de Sucesso < 90%**: Verificar configurações e conectividade

### 📈 Testes de Carga
- **Tempo Médio < 500ms**: Excelente performance
- **Tempo Médio 500-1000ms**: Performance aceitável
- **Tempo Médio > 1000ms**: Necessita otimização
- **Taxa de Sucesso ≥ 95%**: Sistema estável
- **Taxa de Sucesso < 95%**: Possíveis gargalos

## 🚨 Troubleshooting

### Problemas Comuns:
1. **API não responde**: Verificar se o Docker Compose está rodando
2. **Erro de autenticação**: Verificar credenciais admin/123
3. **Timeout nos testes**: Aumentar intervalos entre requests
4. **Falhas em S3/SQS**: Verificar conectividade com LocalStack

### Logs Úteis:
```bash
# Ver logs do container da API
docker-compose logs localstack-api

# Ver logs do LocalStack
docker-compose logs localstack

# Verificar status dos containers
docker-compose ps
```

## 🎯 Fluxo de Testes Recomendado

1. **Iniciar o ambiente:**
   ```bash
   docker-compose up -d
   ```

2. **Executar testes de integração:**
   ```bash
   cd scripts
   npm run integration
   ```

3. **Executar testes de carga:**
   ```bash
   npm run load
   ```

4. **Gerar tráfego contínuo:**
   ```bash
   npm run generate-traffic
   ```

5. **Monitorar no Grafana:**
   - Acesse: http://localhost:3001
   - Login: admin/admin
   - Visualize os dashboards

## 📈 Benefícios dos Testes

- **Validação completa** de todos os endpoints
- **Medição de performance** real
- **Identificação de gargalos** antes da produção
- **Relatórios detalhados** para análise
- **Automação** do processo de teste
- **Confiança** na qualidade do sistema 
