#!/bin/bash

echo "🐳 Execu Status - Docker Setup"
echo "==============================="
echo ""

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop e tente novamente."
    exit 1
fi

echo "✅ Docker está rodando"

# Verificar se docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não encontrado. Instale docker-compose e tente novamente."
    exit 1
fi

echo "✅ docker-compose encontrado"
echo ""

echo "🏗️  Fazendo build dos containers..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    echo ""
    
    echo "🚀 Iniciando serviços..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Serviços iniciados!"
        echo ""
        echo "📊 Status dos containers:"
        docker-compose ps
        echo ""
        echo "🌐 Acesse a aplicação em:"
        echo "   Frontend: http://localhost"
        echo "   Backend:  http://localhost:3000"
        echo "   Logs:     ./docker-scripts.sh logs"
        echo ""
        echo "🛠️  Comandos úteis:"
        echo "   ./docker-scripts.sh status  - Ver status"
        echo "   ./docker-scripts.sh logs    - Ver logs"
        echo "   ./docker-scripts.sh down    - Parar serviços"
        echo "   ./docker-scripts.sh clean   - Limpeza completa"
    else
        echo "❌ Erro ao iniciar serviços"
        exit 1
    fi
else
    echo "❌ Erro no build dos containers"
    exit 1
fi