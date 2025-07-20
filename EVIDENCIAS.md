# Evidências do Projeto: Simulador Local de Serviços AWS

## 1. Evidência do Planejamento

- [ ] Descrição do escopo e objetivos
- [ ] Cronograma e divisão de sprints
- [ ] Ferramentas e tecnologias escolhidas
- [ ] Estratégia de testes e validação

> _Adicione aqui prints, quadros, links para documentos, ou resumos do planejamento._

---

## 2. Evidência da Execução de Cada Requisito

### 2.1. Requisito: Simulação de S3
- [ ] Evidência (print, log, comando, etc):
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

### 2.2. Requisito: Simulação de SQS
- [ ] Evidência:
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

### 2.3. Requisito: Simulação de DynamoDB
- [ ] Evidência:
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

### 2.4. Requisito: Autenticação JWT
- [ ] Evidência:
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

### 2.5. Requisito: Observabilidade (Prometheus/Grafana)
- [ ] Evidência:
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

### 2.6. Requisito: Infraestrutura como Código (Terraform)
- [ ] Evidência:
- [ ] O que funcionou:
- [ ] O que não funcionou:
- [ ] Solução adotada:

---

## 3. Evidência dos Resultados

- [ ] Prints de dashboards, logs, comandos executados
- [ ] Prints de testes bem-sucedidos e falhas
- [ ] Resumo dos resultados obtidos

---

## 4. Lições Aprendidas

- [ ] O que foi mais fácil do que o esperado?
- [ ] O que foi mais difícil?
- [ ] Quais problemas inesperados surgiram?
- [ ] Como foram solucionados?
- [ ] Sugestões para próximos projetos

---

## 5. Evidências do Progresso

- [ ] Linha do tempo das entregas
- [ ] Prints de reuniões, commits, issues, etc
- [ ] Resumo do avanço em cada sprint

---

## 6. Retrospectiva

- [ ] Pontos positivos
- [ ] Pontos de melhoria
- [ ] O que pode ser feito diferente na próxima vez
- [ ] Espaço para comentários livres 

---

## O que está acontecendo?

- O Terraform está tentando acessar a fila SQS usando o endpoint `http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/minha-fila`.
- Esse endpoint é gerado automaticamente pelo provider AWS, mas o LocalStack espera receber requisições em `http://localhost:4566`.
- O LocalStack pode não estar reconhecendo esse domínio customizado, causando o timeout.

---

## **Como resolver**

### 1. **Forçar o endpoint correto no provider**
No seu bloco `provider "aws"` do Terraform, você já está usando:
```hcl
endpoints {
  sqs      = "http://localhost:4566"
  s3       = "http://localhost:4566"
  dynamodb = "http://localhost:4566"
}
```
Isso está correto para rodar o Terraform na sua máquina.

### 2. **Adicionar `skip_region_validation = true`**
Algumas versões do provider AWS precisam desse parâmetro para evitar problemas com endpoints customizados:
```hcl
<code_block_to_apply_changes_from>
```

### 3. **Limpar o state do Terraform**
Às vezes, o state fica corrompido. Tente:
```sh
terraform state rm aws_sqs_queue.minha_fila
terraform apply
```

### 4. **Verifique se a fila já existe**
Se você criou a fila manualmente com AWS CLI, o Terraform pode estar tentando “importar” uma fila que não foi criada por ele, causando inconsistência.  
Tente deletar a fila manualmente:
```sh
aws --endpoint-url=http://localhost:4566 sqs delete-queue --queue-url http://localhost:4566/000000000000/minha-fila
```
Depois, rode novamente o `terraform apply`.

### 5. **Verifique a versão do provider AWS**
Use uma versão recente do provider AWS no Terraform. No seu `main.tf`, garanta algo assim:
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
}
```

---

## **Resumo prático**

1. Adicione `skip_region_validation = true` no provider.
2. Limpe o state da fila SQS no Terraform.
3. Delete a fila manualmente se necessário.
4. Use uma versão recente do provider AWS.
5. Rode novamente o `terraform apply`.

Se ainda der erro, envie o bloco do provider AWS do seu `main.tf` e a versão do provider que está usando para análise detalhada! 
