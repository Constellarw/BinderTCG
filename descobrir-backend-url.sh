#!/bin/bash

# 🔍 DESCOBRIR URL EXATA DO BACKEND RENDER
echo "🔍 DESCOBRINDO URL EXATA DO BACKEND"
echo "=================================="
echo ""

echo "🎯 Testando URLs mais comuns do Render..."
echo ""

# URLs mais comuns para testar
urls=(
    "https://bindertcg-backend.onrender.com"
    "https://bindertcg.onrender.com"
    "https://binder-tcg.onrender.com"
    "https://binder-tcg-backend.onrender.com"
)

found_url=""

for url in "${urls[@]}"; do
    echo "🧪 Testando: $url"
    
    response=$(curl -s -w "%{http_code}" --max-time 5 "$url/health" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo "   ✅ ENCONTRADO! Backend funcionando"
        found_url="$url"
        break
    elif [ "$http_code" = "404" ]; then
        echo "   ❌ 404 - App existe mas backend não funciona"
    elif [ "$http_code" = "000" ]; then
        echo "   ⏳ Timeout - App pode não existir"
    else
        echo "   ⚠️  Status: $http_code"
    fi
done

echo ""

if [ -n "$found_url" ]; then
    echo "🎉 BACKEND ENCONTRADO!"
    echo "====================="
    echo ""
    echo "📍 URL do Backend: $found_url"
    echo ""
    echo "🔐 URL de Callback para Google Console:"
    echo "$found_url/auth/google/callback"
    echo ""
    echo "📋 CONFIGURAÇÃO COMPLETA PARA GOOGLE CONSOLE:"
    echo "============================================="
    echo ""
    echo "Authorized JavaScript origins:"
    echo "  https://sua-app.vercel.app"
    echo "  http://localhost:3000"
    echo "  http://localhost:3001"
    echo ""
    echo "Authorized redirect URIs:"
    echo "  $found_url/auth/google/callback"
    echo "  http://localhost:5000/auth/google/callback"
    echo ""
    echo "⚡ PRÓXIMOS PASSOS:"
    echo "1. Copie a URL de callback acima"
    echo "2. Adicione no Google Cloud Console"
    echo "3. Salve e aguarde 5-10 minutos"
    echo "4. Teste o login novamente"
else
    echo "❌ BACKEND NÃO ENCONTRADO"
    echo "========================"
    echo ""
    echo "🔧 POSSÍVEIS SOLUÇÕES:"
    echo ""
    echo "1. 📱 Verificar no painel do Render:"
    echo "   - Acesse: https://dashboard.render.com"
    echo "   - Clique no seu app"
    echo "   - Copie a URL que aparece"
    echo ""
    echo "2. 🔍 Procurar manualmente:"
    echo "   - Suas apps no Render têm nomes diferentes"
    echo "   - Teste outras variações de URL"
    echo ""
    echo "3. 📜 Verificar logs do Render:"
    echo "   - Se o app está deployado"
    echo "   - Se tem erros de inicialização"
    echo ""
    echo "4. 🆘 Último recurso:"
    echo "   - Execute: ./URGENTE_RENDER_FIX.sh"
    echo "   - Verifique configuração do Root Directory"
fi

echo ""
echo "🛠️  SCRIPTS ÚTEIS:"
echo "./test-auth.sh           # Testar OAuth com URL encontrada"
echo "./corrigir-redirect-uri.sh # Guia completo de correção"
