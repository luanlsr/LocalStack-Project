#!/bin/bash

echo "🚀 Iniciando script de inicialização da API LocalStack..."

# Função para aguardar LocalStack estar pronto
wait_for_localstack() {
    echo "⏳ Aguardando LocalStack estar pronto..."
    while ! curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; do
        echo "   LocalStack ainda não está pronto, aguardando..."
        sleep 5
    done
    echo "✅ LocalStack está pronto!"
}

# Função para verificar se a API está respondendo
wait_for_api() {
    echo "⏳ Aguardando API estar pronta..."
    while ! curl -s http://localhost:3000/health > /dev/null 2>&1; do
        echo "   API ainda não está pronta, aguardando..."
        sleep 2
    done
    echo "✅ API está pronta!"
}

# Aguardar LocalStack
# wait_for_localstack

# Iniciar a API
echo "🚀 Iniciando API..."
node index.js &

# Aguardar API estar pronta
wait_for_api

echo "🎉 Sistema totalmente operacional!"
echo "📊 Métricas: http://localhost:3000/metrics"
echo "🏥 Health: http://localhost:3000/health"
echo "📝 API: http://localhost:3000"

# Manter o script rodando
wait 
