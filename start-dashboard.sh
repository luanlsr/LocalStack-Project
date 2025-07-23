#!/bin/bash

echo ""
echo "========================================"
echo "   🎯 Dashboard de Testes - LocalStack"
echo "========================================"
echo ""

echo "📂 Navegando para a pasta do dashboard..."
cd test-dashboard

echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "🔧 Instalando dependências..."
    npm install
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🚀 Iniciando o dashboard..."
echo "📊 Acesse: http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

npm start 
