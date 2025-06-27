#!/bin/bash

# 🚀 SCRIPT DE DEPLOY GRATUITO - RENDER + VERCEL
echo "🚀 INICIANDO DEPLOY GRATUITO..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto!${NC}"
    exit 1
fi

echo -e "${BLUE}📋 CHECKLIST PARA DEPLOY GRATUITO${NC}"
echo "=================================="

# Verificar se o backend está configurado
echo -e "${YELLOW}🔍 Verificando configuração do backend...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env não encontrado!${NC}"
    echo "💡 Execute: cp backend/.env.example backend/.env"
    exit 1
fi

if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ backend/package.json não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend configurado${NC}"

# Verificar se o frontend está pronto
echo -e "${YELLOW}🔍 Verificando configuração do frontend...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend configurado${NC}"

# Instruções para o usuário
echo ""
echo -e "${BLUE}📝 INSTRUÇÕES DE DEPLOY${NC}"
echo "========================="
echo ""
echo -e "${YELLOW}PASSO 1: DEPLOY DO BACKEND (RENDER)${NC}"
echo "1. Acesse: https://render.com"
echo "2. Faça login com GitHub"
echo "3. Clique em 'New +' → 'Web Service'"
echo "4. Selecione este repositório"
echo "5. Configure:"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "6. Adicione estas variáveis de ambiente:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   MONGODB_URI=sua-string-de-conexao-mongodb"
echo "   GOOGLE_CLIENT_ID=seu-google-client-id"
echo "   GOOGLE_CLIENT_SECRET=seu-google-client-secret"
echo "   JWT_SECRET=sua-jwt-secret-super-segura"
echo "   FRONTEND_URL=https://sua-app.vercel.app"
echo ""
echo -e "${RED}⚠️  IMPORTANTE: Anote a URL que o Render gerar!${NC}"
echo ""

read -p "✅ Backend deployado no Render? Digite a URL gerada: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ URL do backend é obrigatória!${NC}"
    exit 1
fi

# Criar .env.production
echo -e "${YELLOW}📝 Criando .env.production...${NC}"
cat > .env.production << EOF
REACT_APP_API_URL=$BACKEND_URL
EOF

echo -e "${GREEN}✅ .env.production criado com URL: $BACKEND_URL${NC}"

# Instruções para CORS
echo ""
echo -e "${YELLOW}PASSO 2: CONFIGURAR CORS${NC}"
echo "Adicione sua URL da Vercel no backend/server.js:"
echo ""
echo "const allowedOrigins = ["
echo "  'http://localhost:3000',"
echo "  'http://localhost:3001',"
echo "  'https://sua-app.vercel.app', // ← Adicione aqui"
echo "];"
echo ""

read -p "✅ CORS configurado? (y/n): " cors_config
if [[ $cors_config != "y" ]]; then
    echo -e "${RED}❌ Configure o CORS antes de continuar!${NC}"
    exit 1
fi

# Deploy na Vercel
echo ""
echo -e "${YELLOW}PASSO 3: DEPLOY NA VERCEL${NC}"
echo "Executando deploy..."

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

# Build do projeto
echo -e "${YELLOW}🔨 Fazendo build do projeto...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no build! Verifique os logs acima.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build concluído${NC}"

# Deploy na Vercel
echo -e "${YELLOW}🚀 Fazendo deploy na Vercel...${NC}"
vercel --prod

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no deploy! Verifique os logs acima.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO!${NC}"
echo "==================="
echo ""
echo -e "${BLUE}📝 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Anote a URL da Vercel que foi gerada"
echo "2. Configure OAuth no Google Cloud Console:"
echo "   - Authorized JavaScript origins: https://sua-app.vercel.app"
echo "   - Authorized redirect URIs: $BACKEND_URL/auth/google/callback"
echo ""
echo "3. Teste as funcionalidades:"
echo "   - Login Google"
echo "   - Criar deck"
echo "   - Adicionar cartas"
echo "   - Galeria compartilhada"
echo ""
echo -e "${GREEN}🚀 SEU APP ESTÁ NO AR! 100% GRATUITO!${NC}"
