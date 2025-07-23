# 🎯 Dashboard de Testes - LocalStack API

Dashboard visual moderno e interativo para executar testes de integração e carga da LocalStack API.

## ✨ Funcionalidades

### 🧪 Testes de Integração
- **Health Check** - Verifica se a API está funcionando
- **Autenticação** - Testa o sistema de autenticação JWT
- **Autenticação Inválida** - Testa rejeição de credenciais inválidas
- **Endpoint Protegido** - Testa acesso sem token
- **SQS Send** - Testa envio de mensagem para fila
- **S3 Upload** - Testa upload de arquivo para S3
- **DynamoDB Insert** - Testa inserção de item no DynamoDB
- **DynamoDB Get** - Testa recuperação de item do DynamoDB
- **Prometheus Metrics** - Testa coleta de métricas

### 📊 Testes de Carga
- **Carga Baixa** - 10 requisições simultâneas
- **Carga Média** - 50 requisições simultâneas
- **Carga Alta** - 100 requisições simultâneas
- **Teste de Stress** - 200 requisições simultâneas

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
cd test-dashboard
npm install
```

### 2. Iniciar o Dashboard
```bash
npm start
```

### 3. Acessar o Dashboard
Abra seu navegador e acesse: **http://localhost:3001**

## 🎨 Interface

### Características Visuais
- **Design Moderno** - Interface limpa e responsiva
- **Status em Tempo Real** - Visualização do progresso dos testes
- **Logs Interativos** - Acompanhamento detalhado da execução
- **Métricas Visuais** - Gráficos e indicadores de performance
- **Responsivo** - Funciona em desktop e mobile

### Elementos da Interface
- **Cards de Teste** - Cada teste tem seu próprio card com status
- **Barra de Progresso** - Mostra o progresso da execução
- **Log em Tempo Real** - Exibe logs detalhados da execução
- **Resumo de Resultados** - Estatísticas dos testes executados
- **Botões de Ação** - Controles para executar testes individuais ou em lote

## 🔧 Configuração

### URLs da API
O dashboard está configurado para conectar com:
- **API LocalStack**: `http://localhost:3000`
- **Dashboard**: `http://localhost:3001`

### Personalização
Você pode modificar as configurações no arquivo `dashboard.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000'; // URL da sua API
```

## 📈 Métricas Disponíveis

### Testes de Integração
- Status de cada teste (✅ Sucesso / ❌ Erro)
- Tempo de execução
- Detalhes de erro (quando aplicável)

### Testes de Carga
- Número de requisições executadas
- Taxa de sucesso
- Tempo total de execução
- Requisições por segundo (RPS)
- Tempo médio de resposta

## 🎯 Como Executar Testes

### Teste Individual
1. Clique no botão "Executar" de qualquer teste específico
2. Acompanhe o status em tempo real
3. Veja os resultados no log

### Todos os Testes de Integração
1. Clique em "Executar Todos os Testes"
2. Acompanhe o progresso na barra de progresso
3. Veja o resumo final com estatísticas

### Testes de Carga
1. Escolha o tipo de carga (Baixa, Média, Alta, Stress)
2. Clique no botão correspondente
3. Acompanhe a execução e veja as métricas

## 📊 Interpretação dos Resultados

### Taxa de Sucesso
- **90-100%**: Excelente
- **80-89%**: Bom
- **70-79%**: Regular
- **<70%**: Precisa de atenção

### Tempo de Resposta
- **<100ms**: Muito rápido
- **100-500ms**: Rápido
- **500ms-1s**: Aceitável
- **>1s**: Lento

## 🔍 Troubleshooting

### Problemas Comuns

#### Dashboard não carrega
- Verifique se o servidor está rodando na porta 3001
- Confirme se não há conflitos de porta

#### Testes falham
- Verifique se a API LocalStack está rodando na porta 3000
- Confirme se todos os serviços estão funcionando
- Verifique os logs da API para detalhes

#### Erro de CORS
- O dashboard já está configurado com CORS
- Se persistir, verifique se a API também tem CORS habilitado

## 🛠️ Desenvolvimento

### Estrutura de Arquivos
```
test-dashboard/
├── index.html          # Interface principal
├── dashboard.js        # Lógica do dashboard
├── server.js           # Servidor Express
├── package.json        # Dependências
└── README.md          # Documentação
```

### Adicionando Novos Testes
1. Adicione o teste no array `integrationTests` ou `loadTests`
2. Implemente a lógica no `executeIntegrationTest()` ou `executeLoadTest()`
3. Atualize a interface se necessário

## 📝 Logs e Debugging

### Logs do Dashboard
- Todos os logs são exibidos em tempo real
- Logs incluem timestamps
- Logs podem ser baixados como arquivo de texto

### Debugging
- Abra o console do navegador (F12)
- Verifique a aba Network para requisições
- Use a aba Console para logs detalhados

## 🎉 Próximos Passos

### Melhorias Futuras
- [ ] Gráficos de performance em tempo real
- [ ] Histórico de testes executados
- [ ] Comparação entre execuções
- [ ] Alertas e notificações
- [ ] Integração com CI/CD
- [ ] Relatórios em PDF
- [ ] Métricas avançadas (percentis, distribuição)

---

**🎯 Dashboard criado para facilitar a execução e visualização dos testes da LocalStack API!** 
