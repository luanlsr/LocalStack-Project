# Simulador Local de Serviços AWS com Node.js, Express e LocalStack

## Descrição Geral

Este projeto simula serviços AWS (S3, SQS, DynamoDB) localmente usando Node.js/Express, LocalStack, Docker, Prometheus, Grafana, JWT e Terraform. Ideal para estudo, testes, DevOps e validação de integrações cloud sem custos.

---

## O que é o projeto?

Ambiente local gratuito para simular aplicações que usam AWS, com foco em segurança, automação, modularidade e escalabilidade. Permite aprender e validar DevOps, arquitetura de software e cloud computing na prática.

### Problemas que resolve
- Reduz custos de desenvolvimento e testes em nuvem
- Permite validação local de integrações complexas
- Facilita aprendizado de arquitetura AWS e DevOps
- Proporciona ambiente seguro para testes de autenticação e observabilidade

### Tecnologias AWS simuladas
- **S3** (armazenamento de objetos)
- **SQS** (fila de mensagens)
- **DynamoDB** (banco NoSQL)

---

## Arquitetura

```
Usuário → [API Express] → [SQS (mensagem)] → [DynamoDB (persistência)]
                        ↘ [S3 (upload)]
```

- **Docker Compose**: Orquestra containers da API, LocalStack, Prometheus e Grafana
- **LocalStack**: Simula AWS (S3, SQS, DynamoDB)
- **Prometheus**: Coleta métricas da API
- **Grafana**: Visualização de métricas (porta 3001)

## 📁 Estrutura Organizacional

```
projeto-localstack/
├── docker-compose.yml          # Orquestração dos containers
├── localstack-api/             # API Node.js com Express
│   ├── Dockerfile              # Container da API
│   ├── index.js                # Ponto de entrada da API
│   ├── api/                    # Estrutura modular da API
│   │   ├── app.js              # Configuração do Express
│   │   ├── routes/             # Rotas da API
│   │   ├── middlewares/        # Middlewares (JWT, retry)
│   │   ├── services/           # Serviços (AWS, Prometheus)
│   │   └── utils/              # Utilitários
│   ├── package.json            # Dependências da API
│   └── start.sh                # Script de inicialização
├── terraform/                  # Infraestrutura como código
│   └── main.tf                 # Configuração Terraform
├── grafana/                    # Dashboards do Grafana
│   ├── grafana-dashboard.json  # Dashboard principal
│   └── README.md               # Instruções de importação
├── scripts/                    # Scripts de teste e automação
│   ├── generate-traffic.js     # Gerador de tráfego
│   ├── package.json            # Dependências dos scripts
│   └── README.md               # Instruções de uso
├── prometheus.yml              # Configuração do Prometheus
├── setup_infra.sh              # Script de setup da infraestrutura
└── README.md                   # Este arquivo
```

---

## Tecnologias Utilizadas
- **Node.js** & **Express**
- **Docker** & **Docker Compose**
- **LocalStack**
- **Prometheus**
- **Grafana**
- **JWT**
- **Terraform**

---

## Como Rodar o Projeto

### Pré-requisitos
- Docker
- Docker Compose
- Node.js >= 18.x
- Terraform >= 1.0 (opcional, para IaC)
- AWS CLI (opcional, para comandos manuais)

### Passo a passo
1. **Clone o repositório:**
   ```bash
   git clone <repo-url>
   cd projeto-localstack
   ```
2. **Suba o ambiente:**
   ```bash
   docker-compose up --build
   ```
3. **(Opcional) Provisione infraestrutura com Terraform:**
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```
4. **Valide os recursos criados com AWS CLI:**
   ```bash
   aws --endpoint-url=http://localhost:4566 s3 ls --output json
   aws --endpoint-url=http://localhost:4566 sqs list-queues --output json
   aws --endpoint-url=http://localhost:4566 dynamodb list-tables --output json
   ```
   - Verifique se aparecem o bucket, a fila e a tabela esperados.
5. **Acesse os serviços:**
   - API: http://localhost:3000
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (login: admin/admin)
   - LocalStack: http://localhost:4566

---

## Como Usar a API

### Autenticação JWT
- Gere um token JWT via endpoint de login:
  ```bash
  curl -X POST http://localhost:3000/auth/login -d '{"user":"admin","password":"123"}' -H "Content-Type: application/json"
  ```
- Use o token no header `Authorization: Bearer <token>` para acessar os endpoints protegidos.

### Principais Endpoints
- **Enviar mensagem para SQS**
  ```bash
  curl -X POST http://localhost:3000/sqs/send \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"message": "Olá, fila!"}'
  ```
- **Upload para S3**
  ```bash
  curl -X POST http://localhost:3000/s3/upload \
    -H "Authorization: Bearer <token>" \
    -F "file=@/caminho/para/arquivo.txt"
  ```
- **Operações com DynamoDB**
  - Criar item:
    ```bash
    curl -X POST http://localhost:3000/dynamodb/item \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{"id": "1", "data": "valor"}'
    ```
  - Buscar item:
    ```bash
    curl -X GET http://localhost:3000/dynamodb/item/1 \
      -H "Authorization: Bearer <token>"
    ```

---

## Observabilidade
- **Métricas Prometheus**: expostas em `/metrics` na API (http://localhost:3000/metrics)
- **Grafana**: dashboards prontos em http://localhost:3001 (login: admin/admin)

---

## Testes e Automação

### Scripts de Teste
- **Gerador de Tráfego**: Script automatizado para testar todos os endpoints
  ```bash
  cd scripts
  npm install
  npm run generate-traffic
  ```

### Dashboards do Grafana
- **Importar Dashboard**: Use o arquivo `grafana/grafana-dashboard.json`
  ```bash
  # Acesse: http://localhost:3001
  # Importe o arquivo: grafana/grafana-dashboard.json
  ```

### Testes Manuais
- **Testes de Integração**: scripts automatizados cobrem os principais fluxos (autenticação, SQS, S3, DynamoDB)
- **Teste de carga**: simulação de 100 requisições/segundo com [k6](https://k6.io/)
  ```bash
  k6 run test/k6-load.js
  ```
- **Rodar novamente os testes:**
  ```bash
  npm test
  # ou
  k6 run test/k6-load.js
  ```

---

## Infraestrutura como Código
- **Terraform**: scripts em `/terraform` criam bucket S3, fila SQS e tabela DynamoDB no LocalStack.
- **Comandos principais:**
  ```bash
  cd terraform
  terraform init
  terraform apply
  ```
- **Recursos criados:**
  - Bucket S3: `meu-bucket-teste`
  - Fila SQS: `minha-fila`
  - Tabela DynamoDB: `Tarefas`

---

## Troubleshooting
- **Erro de tabela DynamoDB não existente:**
  - Provisione a infraestrutura antes de rodar testes.
- **LocalStack unhealthy:**
  - Se responder no endpoint `/_localstack/health`, pode ignorar o status "unhealthy".
- **Portas:**
  - API: 3000
  - Grafana: 3001
  - Prometheus: 9090
  - LocalStack: 4566

---

## Créditos
- **Autor:** Luan da Silva Ramalho
- **Data de desenvolvimento:** Julho/2025

> Para dúvidas, sugestões ou contribuições, abra uma issue ou envie um pull request. 

## Causa do problema
O script `start.sh` da sua API está esperando o endpoint de health do LocalStack responder, mas aparentemente o LocalStack demora ou não responde como esperado nesse endpoint, fazendo a API nunca subir.

## Solução rápida e prática

### 1. **Remover a espera pelo health do LocalStack**
Você pode comentar ou remover a função `wait_for_localstack` do `start.sh` para que a API suba imediatamente, sem esperar o health do LocalStack.

#### Como fazer:
1. Abra o arquivo `localstack-api/start.sh`.
2. Comente ou remova estas linhas:
   ```bash
   # Aguardar LocalStack
   wait_for_localstack
   ```
3. Salve o arquivo.

Assim, o script vai iniciar a API direto, sem esperar o LocalStack.

---

### 2. **(Opcional) Melhorar a verificação**
Se quiser manter alguma verificação, troque o endpoint de health por um comando simples, como testar a porta 4566:

```bash
wait_for_localstack() {
    echo "⏳ Aguardando LocalStack abrir a porta 4566..."
    local max_attempts=20
    local attempt=1
    while ! nc -z localstack 4566; do
        if (( attempt >= max_attempts )); then
            echo "❌ Timeout ao aguardar LocalStack."
            exit 1
        fi
        echo "   Porta 4566 ainda não está aberta, aguardando... (tentativa $attempt)"
        sleep 2
        ((attempt++))
    done
    echo "✅ Porta 4566 aberta!"
}
```
E use:
```bash
wait_for_localstack
```
> **Obs:** O comando `nc` (netcat) precisa estar disponível no container.

---

### 3. **Reinicie os containers**
Após editar o script, reinicie os containers:
```sh
docker-compose down
docker-compose up --build
```

---

## Resumo
- O problema é a espera pelo health do LocalStack.
- Remova ou comente a linha `wait_for_localstack` no `start.sh` para subir a API imediatamente.
- Se quiser, substitua por uma verificação mais simples (porta aberta).
- Reinicie os containers.

Se seguir esses passos, sua API deve subir normalmente.  
Se ainda travar, me envie o novo log após a alteração! 

## Testes de conectividade com o LocalStack

Se você tiver problemas para aplicar recursos com o Terraform ou acessar serviços simulados, siga estes passos para testar se o LocalStack está rodando corretamente:

### 1. Verifique se o LocalStack está rodando

No terminal, execute:
```sh
curl http://localhost:4566/_localstack/health
```
Se o LocalStack estiver rodando, você verá uma resposta JSON com o status dos serviços.

### 2. Verifique os containers Docker

Execute:
```sh
docker ps
```
Procure por um container chamado `localstack` ouvindo na porta 4566.

### 3. Teste criar uma fila SQS com AWS CLI

Execute:
```sh
aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name teste-fila --output json
```
Se aparecer um erro como `Unknown output type: localstack`, verifique o arquivo `~/.aws/config` e troque ou remova a linha:
```
output = localstack
```
Deixe como:
```
output = json
```

### 4. Dicas rápidas de solução de problemas
- O endpoint raiz `http://localhost:4566/` normalmente não retorna página, use `/health` ou `/sqs` para testar.
- Se o comando `curl` ou AWS CLI não responder, reinicie o LocalStack:
  ```sh
  docker-compose down
  docker-compose up --build
  ```
- Se o Terraform der timeout, limpe o state da fila SQS:
  ```sh
  terraform state rm aws_sqs_queue.minha_fila
  terraform apply
  ```
- Sempre use `--output json` nos comandos AWS CLI para evitar problemas de configuração.

--- 

## **Testes após o `terraform apply`**

### **1. Listar buckets S3**
```sh
aws --endpoint-url=http://localhost:4566 s3 ls --output json
```
Você deve ver o bucket `meu-bucket-local` listado.

---

### **2. Listar filas SQS**
```sh
aws --endpoint-url=http://localhost:4566 sqs list-queues --output json
```
Você deve ver a fila `minha-fila` na lista de URLs.

---

### **3. Listar tabelas DynamoDB**
```sh
aws --endpoint-url=http://localhost:4566 dynamodb list-tables --output json
```
Você deve ver a tabela `Tarefas` na lista.

---

### **4. (Opcional) Testar envio de mensagem para SQS**
```sh
aws --endpoint-url=http://localhost:4566 sqs send-message --queue-url http://localhost:4566/000000000000/minha-fila --message-body "Teste LocalStack"
```
Se funcionar, a fila está operacional.

---

### **5. (Opcional) Testar inserção de item no DynamoDB**
```sh
aws --endpoint-url=http://localhost:4566 dynamodb put-item --table-name Tarefas --item '{"id": {"S": "1"}, "nome": {"S": "Teste"}}'
```
Se não houver erro, a tabela está operacional.

---

## **Resumo para o README**

Você pode adicionar uma seção assim ao README, logo após o passo do `terraform apply`:

---

### **Valide os recursos criados com AWS CLI:**
```sh
aws --endpoint-url=http://localhost:4566 s3 ls --output json
aws --endpoint-url=http://localhost:4566 sqs list-queues --output json
aws --endpoint-url=http://localhost:4566 dynamodb list-tables --output json
```
- Verifique se aparecem o bucket, a fila e a tabela esperados.

---

Se quiser, posso atualizar o README para incluir esses comandos de validação logo após o passo do `terraform apply`. Deseja que eu faça isso? 

---

## Dicas importantes sobre persistência e observabilidade

### Persistência dos recursos do LocalStack
- Por padrão, o LocalStack simula os serviços AWS **em memória**. Ao rodar `docker-compose down`, todos os recursos criados (S3, SQS, DynamoDB, etc.) são perdidos.
- Sempre que subir o ambiente novamente (`docker-compose up`), rode o `terraform apply` para recriar toda a infraestrutura simulada.
- **Se quiser manter os recursos entre reinicializações**, adicione um volume persistente ao serviço LocalStack no `docker-compose.yml`:
  ```yaml
  localstack:
    ...
    volumes:
      - ./localstack-data:/tmp/localstack/data
  ```
- Com volume persistente, só rode o `terraform apply` quando quiser criar ou alterar recursos.

### Configuração do Data Source Prometheus no Grafana
- Ao adicionar o Data Source Prometheus no Grafana, use a URL:
  ```
  http://prometheus:9090
  ```
- Mesmo que o navegador não resolva esse endereço, **o Grafana acessa o Prometheus via rede Docker Compose**.
- Se aparecer erro de conexão, reinicie os containers e aguarde o Prometheus estar pronto antes de testar no Grafana.

### Resumo prático
- Sempre rode `terraform apply` após reiniciar o LocalStack, a menos que use volume persistente.
- Use sempre `http://prometheus:9090` como URL do Prometheus no Grafana.
- Para manter recursos entre reinicializações, configure volume persistente no LocalStack.

--- 

## Sugestão de Painéis para Dashboard de Observabilidade (Grafana)

Ao criar seu dashboard no Grafana, utilize as seguintes sugestões de painéis para monitorar sua API e infraestrutura local:

1. **Requisições por Segundo (RPS)**
   - **Query:**
     ```
     rate(http_requests_total[1m])
     ```
     *(ou ajuste para o nome da métrica de requisições da sua API, se diferente)*
   - **Título do painel:** Requisições por Segundo

2. **Erros por Segundo (4xx/5xx)**
   - **Query:**
     ```
     rate(http_requests_total{status=~"4..|5.."}[1m])
     ```
     *(ajuste o nome da métrica se necessário)*
   - **Título do painel:** Erros por Segundo (4xx/5xx)

3. **Latência (p50)**
   - **Query:**
     ```
     histogram_quantile(0.5, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
     ```
     *(ajuste o nome da métrica se necessário)*
   - **Título do painel:** Latência (p50)

4. **Heap Size (Memória)**
   - **Query:**
     ```
     process_resident_memory_bytes
     ```
   - **Título do painel:** Heap Size (Memória)

5. **Event Loop Lag**
   - **Query:**
     ```
     nodejs_eventloop_lag_seconds
     ```
   - **Título do painel:** Event Loop Lag

6. **Health do LocalStack**
   - **Query:**
     ```
     localstack_health_status
     ```
   - **Título do painel:** Health do LocalStack

7. **Health dos Serviços AWS**
   - **Query:**
     ```
     aws_service_health_status
     ```
   - **Título do painel:** Health dos Serviços AWS (use a legenda `{{service}}` para separar por serviço)

> **Dica:** Se alguma query não retornar dados, acesse `http://localhost:3000/metrics` e veja o nome exato da métrica exposta pela sua API — use esse nome na query.

--- 
