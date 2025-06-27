#!/bin/bash

# 🧪 Script de Teste do Backend em Produção - BinderTCG
# Testa se o backend deployado no Render está funcionando

echo "🧪 TESTE DO BACKEND EM PRODUÇÃO"
echo "================================"
echo ""

# Verificar se curl está disponível
if ! command -v curl &> /dev/null; then
    echo "❌ curl não encontrado. Instale curl para executar os testes."
    exit 1
fi

# Solicitar URL do backend
echo "📝 Digite a URL do seu backend no Render:"
echo "   Exemplo: https://bindertcg-backend.onrender.com"
echo ""
read -p "🌐 URL do backend: " BACKEND_URL

# Remover trailing slash se existir
BACKEND_URL=${BACKEND_URL%/}

# Validar URL
if [[ ! $BACKEND_URL =~ ^https?:// ]]; then
    echo "❌ URL inválida. Deve começar com http:// ou https://"
    exit 1
fi

echo ""
echo "🔍 Testando backend: $BACKEND_URL"
echo "================================="
echo ""

# Função para testar uma rota
test_route() {
    local route=$1
    local description=$2
    local url="$BACKEND_URL$route"
    
    echo "📡 Testando: $description"
    echo "   URL: $url"
    
    # Fazer requisição com timeout
    response=$(curl -s -w "\n%{http_code}" --max-time 30 "$url" 2>/dev/null)
    
    # Separar corpo da resposta e código HTTP
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        echo "   ✅ Status: $http_code"
        if command -v jq &> /dev/null && echo "$body" | jq . &> /dev/null; then
            echo "   📄 Resposta JSON:"
            echo "$body" | jq . | sed 's/^/      /'
        else
            echo "   📄 Resposta:"
            echo "$body" | sed 's/^/      /'
        fi
    elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
        echo "   ❌ Falha na conexão - Backend não está respondendo"
        echo "      Possíveis causas:"
        echo "      - Backend ainda está fazendo deploy"
        echo "      - URL incorreta"
        echo "      - Erro interno no servidor"
    else
        echo "   ⚠️  Status: $http_code"
        echo "   📄 Resposta:"
        echo "$body" | sed 's/^/      /'
    fi
    
    echo ""
}

# 1. Testar rota raiz
test_route "/" "Rota raiz - Informações da API"

# 2. Testar health check
test_route "/health" "Health Check - Status do servidor"

# 3. Testar rota de autenticação Google (deve redirecionar)
echo "📡 Testando: Redirecionamento OAuth Google"
echo "   URL: $BACKEND_URL/auth/google"

# Para OAuth, apenas verificamos se não dá erro 404
response=$(curl -s -w "\n%{http_code}" --max-time 10 "$BACKEND_URL/auth/google" 2>/dev/null)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "302" ] || [ "$http_code" = "301" ]; then
    echo "   ✅ Status: $http_code - Redirecionamento OK"
elif [ "$http_code" = "404" ]; then
    echo "   ❌ Status: $http_code - Rota não encontrada"
elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
    echo "   ❌ Falha na conexão"
else
    echo "   ⚠️  Status: $http_code"
fi

echo ""

# 4. Testar rotas protegidas (devem retornar 401)
echo "📡 Testando: Rota protegida de decks (deve retornar 401)"
echo "   URL: $BACKEND_URL/api/decks"

response=$(curl -s -w "\n%{http_code}" --max-time 10 "$BACKEND_URL/api/decks" 2>/dev/null)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "401" ]; then
    echo "   ✅ Status: $http_code - Proteção funcionando (sem token)"
elif [ "$http_code" = "404" ]; then
    echo "   ❌ Status: $http_code - Rota não encontrada"
elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
    echo "   ❌ Falha na conexão"
else
    echo "   ⚠️  Status: $http_code"
fi

echo ""
echo ""

# Resumo dos testes
echo "📊 RESUMO DOS TESTES:"
echo "===================="
echo ""

# Fazer uma última verificação na rota health
health_response=$(curl -s --max-time 10 "$BACKEND_URL/health" 2>/dev/null)
if echo "$health_response" | grep -q "BinderTCG Backend is running"; then
    echo "✅ BACKEND FUNCIONANDO CORRETAMENTE!"
    echo ""
    echo "🎉 Seu backend está pronto para uso:"
    echo "   🌐 URL: $BACKEND_URL"
    echo "   🔗 Health: $BACKEND_URL/health"
    echo "   🔐 OAuth: $BACKEND_URL/auth/google"
    echo ""
    echo "📝 PRÓXIMOS PASSOS:"
    echo "1. ✅ Backend OK - configurado no Render"
    echo "2. 🚀 Agora faça deploy do frontend na Vercel"
    echo "3. 🔧 Atualize FRONTEND_URL no Render"
    echo "4. 🔐 Configure OAuth no Google Cloud Console"
else
    echo "❌ BACKEND COM PROBLEMAS"
    echo ""
    echo "🔧 POSSÍVEIS SOLUÇÕES:"
    echo ""
    echo "1. 📁 Verificar Root Directory no Render:"
    echo "   - Deve ser: 'backend'"
    echo "   - Settings → Build & Deploy → Root Directory"
    echo ""
    echo "2. 🔐 Verificar variáveis de ambiente:"
    echo "   - NODE_ENV=production"
    echo "   - PORT=10000" 
    echo "   - MONGODB_URI=sua-uri-mongodb"
    echo "   - JWT_SECRET=sua-jwt-secret"
    echo "   - Todas as outras variáveis"
    echo ""
    echo "3. 🔄 Forçar redeploy:"
    echo "   - Manual Deploy → Deploy latest commit"
    echo ""
    echo "4. 📜 Verificar logs no Render:"
    echo "   - Aba Logs → procurar erros"
    echo ""
    echo "5. 🧪 Executar diagnóstico local:"
    echo "   - ./check-backend.sh"
fi

echo ""
echo "📖 Para mais ajuda, consulte:"
echo "   - RENDER_PAINEL_GUIA.md"
echo "   - DEPLOY_GRATUITO.md"
