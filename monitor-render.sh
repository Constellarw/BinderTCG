#!/bin/bash

# 🔍 MONITOR CONTÍNUO - Acompanhar correção do Render
echo "🔍 MONITOR CONTÍNUO - RENDER"
echo "============================"
echo ""

BACKEND_URL="https://bindertcg-backend.onrender.com"

echo "🎯 Monitorando: $BACKEND_URL"
echo "⏰ Pressione Ctrl+C para parar"
echo ""

# Contador
count=1

while true; do
    echo "🧪 Teste #$count - $(date +%H:%M:%S)"
    
    # Testar health check
    response=$(curl -s -w "%{http_code}" --max-time 5 "$BACKEND_URL/health" 2>/dev/null)
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo "🎉 SUCESSO! Backend funcionando!"
        echo "📄 Resposta: $body"
        echo ""
        echo "✅ CORREÇÃO CONCLUÍDA!"
        echo "🚀 Seu OAuth deve funcionar agora!"
        echo ""
        echo "📝 Próximos passos:"
        echo "1. Execute: ./test-pos-correcao.sh"
        echo "2. Teste o login no frontend"
        break
    elif [ "$http_code" = "404" ]; then
        echo "❌ Status: 404 - Ainda com problema"
    elif [ "$http_code" = "000" ]; then
        echo "⏳ Timeout - Deploy em andamento?"
    else
        echo "⚠️  Status: $http_code"
    fi
    
    # Aguardar antes do próximo teste
    sleep 10
    count=$((count + 1))
    
    # Limitar para não rodar infinitamente
    if [ $count -gt 100 ]; then
        echo ""
        echo "⏰ Timeout do monitor (16+ minutos)"
        echo "🔧 Verifique manualmente o painel do Render"
        break
    fi
done
