# 📊 Grafana Dashboards

Esta pasta contém os dashboards do Grafana para monitoramento da API LocalStack.

## 📁 Arquivos

### `grafana-dashboard.json`
Dashboard principal de monitoramento que inclui:

- **🔴 Gauges de Health Status:**
  - LocalStack Health
  - S3 Health
  - SQS Health
  - DynamoDB Health

- **📈 Gráficos de Performance:**
  - Node.js Process CPU
  - Node.js Heap Usage

## 🚀 Como importar

1. Acesse o Grafana: `http://localhost:3001`
2. Clique em **"+"** → **"Import"**
3. Clique em **"Upload JSON file"**
4. Selecione o arquivo `grafana-dashboard.json`
5. Configure **"Prometheus"** como fonte de dados
6. Clique em **"Import"**

## 📋 Configuração da Fonte de Dados

Certifique-se de que o Prometheus está configurado como fonte de dados:
- **URL:** `http://prometheus:9090`
- **Access:** `Server (default)`

## 🔄 Atualização

O dashboard atualiza automaticamente a cada 10 segundos. 
