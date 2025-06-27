#!/bin/bash

# 🚀 SCRIPT DE DEPLOY PARA VERCEL COM CONFIGURAÇÃO AUTOMÁTICA
echo "🚀 CONFIGURANDO E FAZENDO DEPLOY NA VERCEL..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se .env.production existe
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Arquivo .env.production não encontrado!${NC}"
    echo -e "${YELLOW}💡 Crie o arquivo .env.production com:${NC}"
    echo "REACT_APP_API_URL=https://sua-app.onrender.com"
    exit 1
fi

# Ler a URL do backend do .env.production
BACKEND_URL=$(grep "REACT_APP_API_URL=" .env.production | cut -d'=' -f2)

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ REACT_APP_API_URL não encontrado no .env.production!${NC}"
    exit 1
fi

echo -e "${BLUE}🔗 URL do Backend: $BACKEND_URL${NC}"

# Configurar variável de ambiente na Vercel
echo -e "${YELLOW}⚙️ Configurando variável de ambiente na Vercel...${NC}"
vercel env add REACT_APP_API_URL production <<< "$BACKEND_URL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Variável de ambiente configurada${NC}"
else
    echo -e "${YELLOW}⚠️ Variável pode já existir, continuando...${NC}"
fi

# Fazer o deploy
echo -e "${YELLOW}🚀 Fazendo deploy na Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
    echo ""
    echo -e "${BLUE}📋 PRÓXIMOS PASSOS:${NC}"
    echo "1. Anote a URL da Vercel que foi gerada"
    echo "2. Atualize a variável FRONTEND_URL no Render com essa URL"
    echo "3. Configure OAuth no Google Cloud Console"
    echo "4. Teste sua aplicação"
else
    echo -e "${RED}❌ Erro no deploy!${NC}"
    echo -e "${YELLOW}💡 Possíveis soluções:${NC}"
    echo "1. Verifique se o build está funcionando: npm run build"
    echo "2. Verifique se está logado na Vercel: vercel login"
    echo "3. Tente novamente: vercel --prod"
    exit 1
fi
