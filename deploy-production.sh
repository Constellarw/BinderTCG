#!/bin/bash

# Script automatizado para deploy em produção
echo "🚀 INICIANDO DEPLOY PARA PRODUÇÃO..."

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto BinderTCG"
    exit 1
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 1. PREPARANDO FRONTEND..."

# Criar build de produção
echo "🏗️ Criando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do frontend"
    exit 1
fi

echo "✅ Build criado com sucesso!"

echo "🔧 2. CONFIGURANDO VARIÁVEIS..."

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando..."
    echo "REACT_APP_API_URL=https://seu-backend-url.railway.app" > .env
    echo "📝 Edite o arquivo .env com a URL correta do seu backend"
fi

echo "🚀 3. FAZENDO DEPLOY NA VERCEL..."

# Deploy
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Configure as variáveis de ambiente na Vercel Dashboard"
    echo "2. Atualize as URLs no Google OAuth Console"
    echo "3. Configure o CORS no backend com a nova URL"
    echo "4. Teste todas as funcionalidades"
    echo ""
    echo "🔗 Acesse: https://vercel.com/dashboard para gerenciar o projeto"
else
    echo "❌ Erro no deploy"
    exit 1
fi
