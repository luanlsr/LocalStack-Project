# 🚀 Simulador Local de Serviços AWS

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)
![LocalStack](https://img.shields.io/badge/LocalStack-AWS%20Local-orange?style=for-the-badge)
![Terraform](https://img.shields.io/badge/Terraform-IaC-purple?style=for-the-badge&logo=terraform)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-red?style=for-the-badge&logo=prometheus)
![Grafana](https://img.shields.io/badge/Grafana-Visualization-orange?style=for-the-badge&logo=grafana)

**Ambiente completo para simular serviços AWS localmente com monitoramento e observabilidade**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/projeto-localstack?style=social)](https://github.com/seu-usuario/projeto-localstack)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/projeto-localstack?style=social)](https://github.com/seu-usuario/projeto-localstack)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/projeto-localstack)](https://github.com/seu-usuario/projeto-localstack/issues)
[![GitHub license](https://img.shields.io/github/license/seu-usuario/projeto-localstack)](https://github.com/seu-usuario/projeto-localstack/blob/main/LICENSE)

</div>

---

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🏗️ Arquitetura](#️-arquitetura)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Tecnologias](#️-tecnologias)
- [⚡ Quick Start](#-quick-start)
- [🔧 Instalação Detalhada](#-instalação-detalhada)
- [📚 Como Usar](#-como-usar)
- [📊 Monitoramento](#-monitoramento)
- [🧪 Testes](#-testes)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contribuição](#-contribuição)

---

## 🎯 Sobre o Projeto

### 💡 O que é?

Este projeto simula serviços AWS (S3, SQS, DynamoDB) localmente usando Node.js/Express, LocalStack, Docker, Prometheus, Grafana, JWT e Terraform. **Ideal para estudo, testes, DevOps e validação de integrações cloud sem custos.**

### 🎯 Problemas que Resolve

| Problema | Solução |
|----------|---------|
| 💰 **Custos altos** de desenvolvimento em nuvem | ✅ **Ambiente local gratuito** |
| 🔒 **Dificuldade** para testar integrações AWS | ✅ **Simulação completa** dos serviços |
| 📚 **Complexidade** para aprender AWS/DevOps | ✅ **Ambiente didático** e prático |
| 🔐 **Segurança** em testes de autenticação | ✅ **Ambiente isolado** e seguro |

### ☁️ Serviços AWS Simulados

| Serviço | Descrição | Status |
|---------|-----------|--------|
| 🗄️ **S3** | Armazenamento de objetos | ✅ Funcionando |
| 📨 **SQS** | Fila de mensagens | ✅ Funcionando |
| 🗃️ **DynamoDB** | Banco NoSQL | ✅ Funcionando |

---

## 🏗️ Arquitetura

```mermaid
graph LR
    A[👤 Usuário] --> B[🌐 API Express]
    B --> C[📨 SQS]
    B --> D[🗄️ S3]
    B --> E[🗃️ DynamoDB]
    B --> F[📊 Prometheus]
    F --> G[📈 Grafana]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fce4ec
    style F fill:#ffebee
    style G fill:#fff8e1
```

### 🔄 Fluxo de Dados

1. **👤 Usuário** faz requisição para a API
2. **🌐 API Express** processa com autenticação JWT
3. **📨 SQS** recebe mensagens
4. **🗄️ S3** armazena arquivos
5. **🗃️ DynamoDB** persiste dados
6. **📊 Prometheus** coleta métricas
7. **📈 Grafana** visualiza dados

---

## 📁 Estrutura do Projeto

```
projeto-localstack/
├── 🐳 docker-compose.yml          # Orquestração dos containers
├── 🚀 localstack-api/             # API Node.js com Express
│   ├── 🐳 Dockerfile              # Container da API
│   ├── 📄 index.js                # Ponto de entrada da API
│   ├── 📂 api/                    # Estrutura modular da API
│   │   ├── ⚙️ app.js              # Configuração do Express
│   │   ├── 🛣️ routes/             # Rotas da API
│   │   ├── 🔒 middlewares/        # Middlewares (JWT, retry)
│   │   ├── 🔧 services/           # Serviços (AWS, Prometheus)
│   │   └── 🛠️ utils/              # Utilitários
│   ├── 📦 package.json            # Dependências da API
│   └── 🚀 start.sh                # Script de inicialização
├── 🏗️ terraform/                  # Infraestrutura como código
│   └── 📄 main.tf                 # Configuração Terraform
├── 📊 grafana/                    # Dashboards do Grafana
│   ├── 📈 grafana-dashboard.json  # Dashboard principal
│   └── 📖 README.md               # Instruções de importação
├── 🧪 scripts/                    # Scripts de teste e automação
│   ├── 🔄 generate-traffic.js     # Gerador de tráfego
│   ├── 📦 package.json            # Dependências dos scripts
│   └── 📖 README.md               # Instruções de uso
├── 📊 prometheus.yml              # Configuração do Prometheus
├── 🛠️ setup_infra.sh              # Script de setup da infraestrutura
└── 📖 README.md                   # Este arquivo
```

---

## 🛠️ Tecnologias

<div align="center">

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **🌐 Backend** | ![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js) | 18.x | Runtime JavaScript |
| **🌐 Framework** | ![Express](https://img.shields.io/badge/Express-4.x-black?logo=express) | 4.x | Framework Web |
| **🐳 Containerização** | ![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker) | Latest | Orquestração |
| **☁️ AWS Local** | ![LocalStack](https://img.shields.io/badge/LocalStack-Latest-orange) | Latest | Simulação AWS |
| **🏗️ IaC** | ![Terraform](https://img.shields.io/badge/Terraform-1.x-purple?logo=terraform) | 1.x | Infraestrutura |
| **📊 Monitoramento** | ![Prometheus](https://img.shields.io/badge/Prometheus-Latest-red?logo=prometheus) | Latest | Métricas |
| **📈 Visualização** | ![Grafana](https://img.shields.io/badge/Grafana-Latest-orange?logo=grafana) | Latest | Dashboards |
| **🔐 Autenticação** | ![JWT](https://img.shields.io/badge/JWT-Tokens-yellow) | - | Autenticação |

</div>

---

## ⚡ Quick Start

### 🚀 Início Rápido (3 minutos)

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/seu-usuario/projeto-localstack.git
cd projeto-localstack

# 2️⃣ Suba o ambiente
docker-compose up -d

# 3️⃣ Acesse os serviços
# 🌐 API: http://localhost:3000
# 📊 Grafana: http://localhost:3001 (admin/admin)
# 📈 Prometheus: http://localhost:9090
# ☁️ LocalStack: http://localhost:4566
```

### 🎯 Teste Rápido

```bash
# 🔐 Login para obter token JWT
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user":"admin","password":"123"}'

# 📨 Enviar mensagem para SQS (use o token obtido)
curl -X POST http://localhost:3000/sqs/send \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, LocalStack!"}'
```

---

## 🔧 Instalação Detalhada

### 📋 Pré-requisitos

| Software | Versão | Como Instalar |
|----------|--------|---------------|
| ![Docker](https://img.shields.io/badge/Docker-20.x+-blue?logo=docker) | 20.x+ | [Docker Desktop](https://www.docker.com/products/docker-desktop) |
| ![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2.x+-blue?logo=docker) | 2.x+ | Incluído no Docker Desktop |
| ![Node.js](https://img.shields.io/badge/Node.js-18.x+-green?logo=node.js) | 18.x+ | [Node.js](https://nodejs.org/) |
| ![Terraform](https://img.shields.io/badge/Terraform-1.x+-purple?logo=terraform) | 1.x+ | [Terraform](https://www.terraform.io/downloads) |
| ![AWS CLI](https://img.shields.io/badge/AWS%20CLI-2.x+-orange) | 2.x+ | [AWS CLI](https://aws.amazon.com/cli/) |

### 🚀 Passo a Passo Completo

#### 1️⃣ **Clone e Prepare**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/projeto-localstack.git
cd projeto-localstack

# Verifique se o Docker está rodando
docker --version
docker-compose --version
```

#### 2️⃣ **Suba o Ambiente**

```bash
# Construa e suba todos os containers
docker-compose up --build -d

# Verifique se todos estão rodando
docker-compose ps
```

#### 3️⃣ **Configure a Infraestrutura (Opcional)**

```bash
# Entre na pasta do Terraform
cd terraform

# Inicialize o Terraform
terraform init

# Aplique a configuração
terraform apply -auto-approve

# Volte para a pasta raiz
cd ..
```

#### 4️⃣ **Valide os Recursos**

```bash
# Verifique se os recursos foram criados
aws --endpoint-url=http://localhost:4566 s3 ls --output json
aws --endpoint-url=http://localhost:4566 sqs list-queues --output json
aws --endpoint-url=http://localhost:4566 dynamodb list-tables --output json
```

#### 5️⃣ **Acesse os Serviços**

| Serviço | URL | Credenciais | Descrição |
|---------|-----|-------------|-----------|
| 🌐 **API** | http://localhost:3000 | - | API principal |
| 📊 **Grafana** | http://localhost:3001 | admin/admin | Dashboards |
| 📈 **Prometheus** | http://localhost:9090 | - | Métricas |
| ☁️ **LocalStack** | http://localhost:4566 | - | Simulação AWS |

---

## 📚 Como Usar

### 🔐 Autenticação JWT

A API usa autenticação JWT. Primeiro, faça login para obter um token:

```bash
# 🔑 Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user": "admin",
    "password": "123"
  }'

# 📤 Resposta esperada:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

### 📨 **SQS - Enviar Mensagem**

```bash
# 📤 Enviar mensagem para fila SQS
curl -X POST http://localhost:3000/sqs/send \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Mensagem de teste para SQS"
  }'

# ✅ Resposta esperada:
# {
#   "message": "Mensagem enviada com sucesso para SQS!",
#   "messageId": "12345678-1234-1234-1234-123456789012"
# }
```

### 🗄️ **S3 - Upload de Arquivo**

```bash
# 📁 Upload de arquivo para S3
curl -X POST http://localhost:3000/s3/upload \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "meu-arquivo.txt",
    "content": "Conteúdo do arquivo"
  }'

# ✅ Resposta esperada:
# {
#   "message": "Arquivo enviado com sucesso para o S3!",
#   "key": "meu-arquivo.txt"
# }
```

### 🗃️ **DynamoDB - Operações**

```bash
# ➕ Inserir item no DynamoDB
curl -X POST http://localhost:3000/dynamodb/item \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123",
    "nome": "João Silva",
    "idade": 30,
    "email": "joao@email.com"
  }'

# ✅ Resposta esperada:
# {
#   "message": "Item inserido com sucesso no DynamoDB!",
#   "item": { "id": "123", "nome": "João Silva", ... }
# }

# 🔍 Buscar item no DynamoDB
curl -X GET http://localhost:3000/dynamodb/item/123 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"

# ✅ Resposta esperada:
# {
#   "message": "Item encontrado no DynamoDB!",
#   "item": { "id": "123", "nome": "João Silva", ... }
# }
```

### 🏥 **Health Check**

```bash
# 🏥 Verificar status dos serviços
curl -X GET http://localhost:3000/health

# ✅ Resposta esperada:
# {
#   "timestamp": "2025-07-19T23:48:08.961Z",
#   "status": "healthy",
#   "services": {
#     "localstack": { "status": "healthy" },
#     "s3": { "status": "healthy" },
#     "sqs": { "status": "healthy" },
#     "dynamodb": { "status": "healthy" }
#   }
# }
```

### 📊 **Métricas Prometheus**

```bash
# 📈 Ver métricas da API
curl -X GET http://localhost:3000/metrics
```

---

## 📊 Monitoramento

### 📈 **Grafana Dashboards**

#### 🚀 **Importar Dashboard**

1. **Acesse o Grafana:** http://localhost:3001
2. **Login:** admin / admin
3. **Importe o dashboard:**
   - Clique em **"+"** → **"Import"**
   - Selecione o arquivo: `grafana/grafana-dashboard.json`
   - Configure **"Prometheus"** como fonte de dados
   - Clique em **"Import"**

#### 📊 **Painéis Disponíveis**

| Painel | Descrição | Métrica |
|--------|-----------|---------|
| 🔴 **LocalStack Health** | Status geral do LocalStack | `localstack_health_status` |
| 🗄️ **S3 Health** | Status do serviço S3 | `aws_service_health_status{service="s3"}` |
| 📨 **SQS Health** | Status do serviço SQS | `aws_service_health_status{service="sqs"}` |
| 🗃️ **DynamoDB Health** | Status do serviço DynamoDB | `aws_service_health_status{service="dynamodb"}` |
| 💻 **CPU Usage** | Uso de CPU da aplicação | `process_cpu_user_seconds_total` |
| 💾 **Memory Usage** | Uso de memória da aplicação | `process_resident_memory_bytes` |

### 📈 **Prometheus**

- **URL:** http://localhost:9090
- **Métricas:** http://localhost:3000/metrics
- **Configuração:** `prometheus.yml`

---

## 🧪 Testes

### 🔄 **Gerador de Tráfego Automático**

```bash
# Entre na pasta de scripts
cd scripts

# Instale as dependências
npm install

# Execute o gerador de tráfego
npm run generate-traffic

# Ou execute diretamente
node generate-traffic.js
```

### 📊 **O que o Script Faz**

1. **🔐 Login** automático com JWT
2. **🔄 Loop** de 10 iterações de testes
3. **📨 SQS** - Envia mensagens
4. **🗄️ S3** - Faz upload de arquivos
5. **🗃️ DynamoDB** - Insere e busca itens
6. **🏥 Health** - Verifica status dos serviços

### 🎯 **Resultado**

```
🚀 Gerando tráfego para popular métricas...
✅ Login realizado com sucesso
✅ Health check 1
✅ DynamoDB 1
✅ SQS 1
✅ S3 1
...
🎉 Tráfego gerado com sucesso!
📊 Acesse o Grafana em: http://localhost:3001
📈 Métricas disponíveis em: http://localhost:3000/metrics
```

### 🧪 **Testes Manuais**

```bash
# Teste de carga com k6 (opcional)
k6 run test/k6-load.js

# Testes unitários (se implementados)
npm test
```

---

## 🚨 Troubleshooting

### ❌ **Problemas Comuns**

| Problema | Sintoma | Solução |
|----------|---------|---------|
| 🔴 **API não sobe** | Container em loop infinito | Verificar logs: `docker-compose logs api` |
| 🔴 **LocalStack unhealthy** | Status "unhealthy" | Ignorar se responde em `/_localstack/health` |
| 🔴 **DynamoDB não existe** | Erro "table does not exist" | Executar `terraform apply` |
| 🔴 **S3 não funciona** | Erro de endpoint | Verificar configuração `s3ForcePathStyle` |
| 🔴 **Grafana sem dados** | Painéis vazios | Verificar fonte de dados Prometheus |

### 🔧 **Comandos de Diagnóstico**

```bash
# 📊 Verificar status dos containers
docker-compose ps

# 📋 Ver logs da API
docker-compose logs api

# 📋 Ver logs do LocalStack
docker-compose logs localstack

# 🔍 Verificar se LocalStack responde
curl http://localhost:4566/_localstack/health

# 🔍 Verificar se API responde
curl http://localhost:3000/health

# 🔍 Verificar métricas
curl http://localhost:3000/metrics
```

### 🔄 **Reinicialização Completa**

```bash
# 🛑 Parar tudo
docker-compose down

# 🧹 Limpar volumes (opcional)
docker-compose down -v

# 🚀 Subir novamente
docker-compose up --build -d

# 🏗️ Recriar infraestrutura
cd terraform
terraform apply -auto-approve
cd ..
```

### 📋 **Checklist de Verificação**

- [ ] Docker está rodando
- [ ] Portas 3000, 3001, 9090, 4566 estão livres
- [ ] Containers estão rodando: `docker-compose ps`
- [ ] LocalStack responde: `curl http://localhost:4566/_localstack/health`
- [ ] API responde: `curl http://localhost:3000/health`
- [ ] Terraform foi aplicado: `terraform state list`

---

## 🤝 Contribuição

### 🎯 **Como Contribuir**

1. **🔀 Fork** o projeto
2. **🌿 Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
3. **💾 Commit** suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. **📤 Push** para a branch: `git push origin feature/nova-funcionalidade`
5. **📝 Abra** um Pull Request

### 📋 **Diretrizes**

- ✅ Mantenha o código limpo e documentado
- ✅ Adicione testes para novas funcionalidades
- ✅ Atualize a documentação quando necessário
- ✅ Siga as convenções de commit do projeto

### 🐛 **Reportar Bugs**

Use o [GitHub Issues](https://github.com/seu-usuario/projeto-localstack/issues) para reportar bugs ou solicitar funcionalidades.

---

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 **Autor**

<div align="center">

**Luan da Silva Ramalho**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/seu-usuario)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/seu-usuario)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:seu-email@exemplo.com)

**Desenvolvido com ❤️ em Julho/2025**

</div>

---

<div align="center">

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/projeto-localstack?style=social)](https://github.com/seu-usuario/projeto-localstack)

</div> 
