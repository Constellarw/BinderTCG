#!/bin/bash

# 🔧 Script de Diagnóstico do Backend - BinderTCG
# Para identificar e corrigir problemas de deploy no Render

echo "🔧 DIAGNÓSTICO DO BACKEND - BinderTCG"
echo "======================================"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "backend/server.js" ]; then
    echo "❌ Execute este script no diretório raiz do projeto (onde está o backend/)"
    exit 1
fi

echo "✅ Diretório correto localizado"
echo ""

# 1. Verificar arquivos essenciais
echo "📁 VERIFICANDO ARQUIVOS ESSENCIAIS:"
echo "-----------------------------------"

files_to_check=(
    "backend/server.js"
    "backend/package.json"
    "backend/Procfile"
    "backend/config/database.js"
    "backend/config/passport.js"
    "backend/routes/auth.js"
    "backend/routes/decks.js"
    "backend/routes/gallery.js"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - ARQUIVO FALTANDO!"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ Arquivos essenciais estão faltando. Verifique a estrutura do projeto."
    exit 1
fi

echo ""

# 2. Verificar dependências no package.json
echo "📦 VERIFICANDO DEPENDÊNCIAS:"
echo "----------------------------"

cd backend

# Verificar se node_modules existe
if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
else
    echo "⚠️  node_modules não encontrado. Execute: npm install"
fi

# Verificar dependências críticas
critical_deps=("express" "mongoose" "cors" "dotenv" "passport" "passport-google-oauth20")
for dep in "${critical_deps[@]}"; do
    if npm list --depth=0 "$dep" > /dev/null 2>&1; then
        echo "✅ $dep instalado"
    else
        echo "❌ $dep - NÃO INSTALADO!"
    fi
done

cd ..

echo ""

# 3. Verificar configuração do Procfile
echo "⚙️  VERIFICANDO PROCFILE:"
echo "------------------------"
if grep -q "web: npm start" backend/Procfile; then
    echo "✅ Procfile configurado corretamente"
else
    echo "❌ Procfile com problema. Deve conter: web: npm start"
fi

echo ""

# 4. Verificar scripts no package.json
echo "📜 VERIFICANDO SCRIPTS:"
echo "----------------------"
if grep -q '"start": "node server.js"' backend/package.json; then
    echo "✅ Script 'start' configurado"
else
    echo "❌ Script 'start' não encontrado ou incorreto"
fi

echo ""

# 5. Testar servidor localmente
echo "🧪 TESTANDO SERVIDOR LOCAL:"
echo "---------------------------"
echo "Iniciando servidor em modo de teste..."

cd backend

# Criar .env temporário para teste se não existir
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando temporário para teste..."
    cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bindertcg-test
JWT_SECRET=test-jwt-secret-for-development-only
SESSION_SECRET=test-session-secret-for-development-only
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret
FRONTEND_URL=http://localhost:3000
EOL
fi

# Tentar iniciar o servidor em modo teste
timeout 10s node server.js &
SERVER_PID=$!
sleep 3

# Testar rota de health check
echo "Testando rota /health..."
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Rota /health respondeu"
    curl -s http://localhost:5000/health | jq .
else
    echo "❌ Rota /health não respondeu"
fi

# Testar rota raiz
echo ""
echo "Testando rota raiz /..."
if curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo "✅ Rota raiz respondeu"
    curl -s http://localhost:5000/ | jq .
else
    echo "❌ Rota raiz não respondeu"
fi

# Matar o servidor de teste
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

cd ..

echo ""
echo ""

# 6. Verificar configuração para Render
echo "🚀 CONFIGURAÇÃO PARA RENDER:"
echo "----------------------------"
echo "Para deploy no Render, certifique-se de:"
echo ""
echo "1. 📁 ROOT DIRECTORY: backend"
echo "2. 🔧 BUILD COMMAND: npm install"
echo "3. ▶️  START COMMAND: npm start"
echo "4. 🌐 ENVIRONMENT: Node"
echo ""
echo "5. 🔐 VARIÁVEIS DE AMBIENTE necessárias:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - MONGODB_URI=sua-mongodb-uri"
echo "   - JWT_SECRET=sua-jwt-secret"
echo "   - SESSION_SECRET=sua-session-secret"
echo "   - GOOGLE_CLIENT_ID=seu-google-client-id"
echo "   - GOOGLE_CLIENT_SECRET=seu-google-client-secret"
echo "   - FRONTEND_URL=sua-url-vercel"
echo ""

# 7. Dicas de solução de problemas
echo "🔧 SOLUÇÕES PARA PROBLEMAS COMUNS:"
echo "----------------------------------"
echo ""
echo "❌ 'Route not found' no Render:"
echo "   - Verifique se ROOT DIRECTORY é 'backend'"
echo "   - Verifique se START COMMAND é 'npm start'"
echo "   - Verifique se todas as variáveis de ambiente estão configuradas"
echo ""
echo "❌ 'Module not found':"
echo "   - Verifique se BUILD COMMAND é 'npm install'"
echo "   - Verifique se package.json está no diretório backend"
echo ""
echo "❌ 'Failed to start':"
echo "   - Verifique as variáveis de ambiente"
echo "   - Verifique se MONGODB_URI está correto"
echo "   - Verifique se PORT=10000"
echo ""
echo "❌ 'CORS errors':"
echo "   - Atualize FRONTEND_URL com a URL da Vercel"
echo "   - Adicione a URL da Vercel no Google Cloud Console"
echo ""

echo "✅ DIAGNÓSTICO CONCLUÍDO!"
echo ""
echo "📖 Para mais detalhes, consulte:"
echo "   - DEPLOY_GRATUITO.md"
echo "   - RENDER_PAINEL_GUIA.md"
echo "   - DEPLOY_RESUMO.md"
