#!/bin/bash

# 🔐 Script de Teste das Rotas de Autenticação
echo "🔐 TESTANDO ROTAS DE AUTENTICAÇÃO"
echo "================================="
echo ""

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
echo "🔍 Testando rotas de autenticação em: $BACKEND_URL"
echo "=================================================="
echo ""

# Função para testar uma rota
test_auth_route() {
    local route=$1
    local description=$2
    local expected_status=$3
    local url="$BACKEND_URL$route"
    
    echo "📡 Testando: $description"
    echo "   URL: $url"
    
    # Fazer requisição com timeout
    response=$(curl -s -w "\n%{http_code}" --max-time 30 "$url" 2>/dev/null)
    
    # Separar corpo da resposta e código HTTP
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo "   ✅ Status: $http_code (esperado)"
        if command -v jq &> /dev/null && echo "$body" | jq . &> /dev/null; then
            echo "   📄 Resposta JSON:"
            echo "$body" | jq . | sed 's/^/      /'
        else
            echo "   📄 Resposta:"
            echo "$body" | sed 's/^/      /' | head -3
        fi
    elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
        echo "   ❌ Falha na conexão - Backend não está respondendo"
    else
        echo "   ❌ Status: $http_code (esperado: $expected_status)"
        echo "   📄 Resposta:"
        echo "$body" | sed 's/^/      /' | head -3
    fi
    
    echo ""
    return $([ "$http_code" = "$expected_status" ] && echo 0 || echo 1)
}

# 1. Testar rota de status de auth
test_auth_route "/auth/status" "Status das rotas de autenticação" "200"
STATUS_OK=$?

# 2. Testar rota do Google OAuth (deve redirecionar - 302)
test_auth_route "/auth/google" "Redirecionamento OAuth Google" "302"
GOOGLE_OK=$?

# 3. Testar rota protegida (deve retornar 401)
test_auth_route "/auth/me" "Rota protegida - informações do usuário" "401"
ME_OK=$?

# 4. Testar logout
test_auth_route "/auth/logout" "Logout do usuário" "200"
LOGOUT_OK=$?

echo ""
echo "📊 RESUMO DOS TESTES DE AUTENTICAÇÃO:"
echo "===================================="
echo ""

total_tests=4
passed_tests=0

if [ $STATUS_OK -eq 0 ]; then
    echo "✅ Status das rotas: OK"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ Status das rotas: FALHOU"
fi

if [ $GOOGLE_OK -eq 0 ]; then
    echo "✅ OAuth Google: OK (redirecionamento funcionando)"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ OAuth Google: FALHOU"
fi

if [ $ME_OK -eq 0 ]; then
    echo "✅ Rota protegida: OK (retorna 401 sem token)"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ Rota protegida: FALHOU"
fi

if [ $LOGOUT_OK -eq 0 ]; then
    echo "✅ Logout: OK"
    passed_tests=$((passed_tests + 1))
else
    echo "❌ Logout: FALHOU"
fi

echo ""
echo "📈 Resultado: $passed_tests/$total_tests testes passaram"

if [ $passed_tests -eq $total_tests ]; then
    echo ""
    echo "🎉 TODAS AS ROTAS DE AUTENTICAÇÃO FUNCIONANDO!"
    echo ""
    echo "🔐 PRÓXIMOS PASSOS PARA OAUTH:"
    echo "1. Acesse Google Cloud Console"
    echo "2. Vá em APIs & Services → Credentials"
    echo "3. Edite seu OAuth 2.0 Client ID"
    echo "4. Adicione estas URLs:"
    echo ""
    echo "   📍 Authorized JavaScript origins:"
    echo "   https://sua-app.vercel.app"
    echo ""
    echo "   📍 Authorized redirect URIs:"
    echo "   $BACKEND_URL/auth/google/callback"
    echo ""
    echo "5. Teste o login completo na sua aplicação"
else
    echo ""
    echo "❌ PROBLEMAS ENCONTRADOS NAS ROTAS DE AUTENTICAÇÃO"
    echo ""
    echo "🔧 POSSÍVEIS SOLUÇÕES:"
    echo ""
    
    if [ $STATUS_OK -ne 0 ]; then
        echo "❌ Rota /auth/status falhou:"
        echo "   - Verifique se as rotas de auth estão sendo carregadas"
        echo "   - Verifique os logs do Render para erros"
        echo ""
    fi
    
    if [ $GOOGLE_OK -ne 0 ]; then
        echo "❌ Rota /auth/google falhou:"
        echo "   - Verifique se GOOGLE_CLIENT_ID está configurado"
        echo "   - Verifique se GOOGLE_CLIENT_SECRET está configurado"
        echo "   - Verifique se BACKEND_URL está configurado"
        echo "   - Verifique os logs do Render para erros do Passport"
        echo ""
    fi
    
    echo "🧪 COMANDOS ÚTEIS:"
    echo "   ./check-backend.sh      # Diagnóstico completo"
    echo "   ./test-backend.sh       # Teste geral do backend"
    echo ""
    echo "📜 Verifique os logs no painel do Render para mais detalhes"
fi
