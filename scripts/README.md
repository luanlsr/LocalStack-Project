# 🧪 Scripts de Teste

Esta pasta contém scripts para testar e gerar tráfego na API LocalStack.

## 📁 Arquivos

### `generate-traffic.js`
Script principal para gerar tráfego artificial e popular métricas do Prometheus.

**Funcionalidades:**
- ✅ Login automático com JWT
- ✅ Teste de todos os endpoints da API
- ✅ Geração de dados para DynamoDB, S3 e SQS
- ✅ Tratamento de erros robusto
- ✅ Intervalo entre requisições

## 🚀 Como usar

### Instalação das dependências:
```bash
cd scripts
npm install
```

### Executar o script:
```bash
# Via npm script
npm run generate-traffic

# Ou diretamente
node generate-traffic.js
```

## 📊 O que o script faz

1. **Login:** Obtém token JWT da API
2. **Loop de testes:** Executa 10 iterações de testes
3. **Endpoints testados:**
   - `GET /health` - Health check
   - `POST /dynamodb/item` - Inserir item no DynamoDB
   - `POST /sqs/send` - Enviar mensagem para SQS
   - `POST /s3/upload` - Upload de arquivo para S3

4. **Resultado:** Gera tráfego para popular métricas do Prometheus

## 🎯 Benefícios

- **Teste completo:** Valida todos os endpoints
- **Métricas:** Popula o Prometheus com dados reais
- **Monitoramento:** Permite visualizar dashboards no Grafana
- **Demonstração:** Mostra o sistema funcionando

## 📈 Após executar

- Acesse o Grafana: `http://localhost:3001`
- Visualize as métricas nos dashboards
- Monitore a performance da API 
