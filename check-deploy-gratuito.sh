#!/bin/bash

# 🔍 CHECKLIST PARA DEPLOY GRATUITO
echo "🔍 VERIFICANDO SE ESTÁ TUDO PRONTO PARA DEPLOY..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

echo -e "${BLUE}📋 CHECKLIST PARA DEPLOY GRATUITO${NC}"
echo "=================================="

# 1. Verificar estrutura do projeto
echo -e "${YELLOW}🔍 Verificando estrutura do projeto...${NC}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado na raiz${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ package.json encontrado${NC}"
fi

if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Pasta backend não encontrada${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Pasta backend encontrada${NC}"
fi

if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ backend/package.json não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ backend/package.json encontrado${NC}"
fi

if [ ! -f "backend/server.js" ]; then
    echo -e "${RED}❌ backend/server.js não encontrado${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ backend/server.js encontrado${NC}"
fi

# 2. Verificar configurações do backend
echo ""
echo -e "${YELLOW}🔍 Verificando configurações do backend...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env não encontrado${NC}"
    echo "💡 Execute: cp backend/.env.example backend/.env"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ backend/.env encontrado${NC}"
    
    # Verificar variáveis essenciais
    if grep -q "MONGODB_URI=" backend/.env; then
        echo -e "${GREEN}✅ MONGODB_URI configurado${NC}"
    else
        echo -e "${RED}❌ MONGODB_URI não encontrado em .env${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "GOOGLE_CLIENT_ID=" backend/.env; then
        echo -e "${GREEN}✅ GOOGLE_CLIENT_ID configurado${NC}"
    else
        echo -e "${RED}❌ GOOGLE_CLIENT_ID não encontrado em .env${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    if grep -q "JWT_SECRET=" backend/.env; then
        echo -e "${GREEN}✅ JWT_SECRET configurado${NC}"
    else
        echo -e "${RED}❌ JWT_SECRET não encontrado em .env${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

# 3. Verificar dependências
echo ""
echo -e "${YELLOW}🔍 Verificando dependências...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não encontrado na raiz${NC}"
    echo "💡 Execute: npm install"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ node_modules encontrado na raiz${NC}"
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  backend/node_modules não encontrado${NC}"
    echo "💡 Execute: cd backend && npm install"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ backend/node_modules encontrado${NC}"
fi

# 4. Verificar se o backend roda ou já está rodando
echo ""
echo -e "${YELLOW}🔍 Testando se o backend está funcionando...${NC}"

# Testar se já está rodando
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend já está rodando na porta 5000${NC}"
else
    # Tentar iniciar o backend
    cd backend
    timeout 10s npm start > /dev/null 2>&1 &
    PID=$!
    sleep 3

    if ps -p $PID > /dev/null; then
        echo -e "${GREEN}✅ Backend inicia sem erros${NC}"
        kill $PID 2>/dev/null
    else
        echo -e "${RED}❌ Backend não consegue iniciar${NC}"
        echo "💡 Execute: cd backend && npm start (para ver erros)"
        ERRORS=$((ERRORS + 1))
    fi

    cd ..
fi

# 5. Verificar se o frontend builda
echo ""
echo -e "${YELLOW}🔍 Testando build do frontend...${NC}"

npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build com sucesso${NC}"
    if [ -d "build" ]; then
        echo -e "${GREEN}✅ Pasta build criada${NC}"
    fi
else
    echo -e "${RED}❌ Erro no build do frontend${NC}"
    echo "💡 Execute: npm run build (para ver erros)"
    ERRORS=$((ERRORS + 1))
fi

# 6. Verificar Git
echo ""
echo -e "${YELLOW}🔍 Verificando Git...${NC}"

if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
    
    # Verificar se tem remote
    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✅ Remote origin configurado${NC}"
        
        # Verificar se está em sync
        if git status --porcelain | grep -q .; then
            echo -e "${YELLOW}⚠️  Há alterações não commitadas${NC}"
            echo "💡 Execute: git add . && git commit -m 'deploy' && git push"
        else
            echo -e "${GREEN}✅ Repositório em sync${NC}"
        fi
    else
        echo -e "${RED}❌ Remote origin não configurado${NC}"
        echo "💡 Execute: git remote add origin <sua-url-github>"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Não é um repositório Git${NC}"
    echo "💡 Execute: git init && git add . && git commit -m 'initial commit'"
    ERRORS=$((ERRORS + 1))
fi

# Resultado final
echo ""
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 TUDO PRONTO PARA DEPLOY!${NC}"
    echo ""
    echo -e "${BLUE}🚀 PRÓXIMOS PASSOS:${NC}"
    echo "1. Execute: ./deploy-gratuito.sh"
    echo "2. Siga as instruções do script"
    echo "3. Configure OAuth no Google Cloud"
    echo "4. Teste sua aplicação"
    echo ""
    echo -e "${GREEN}✨ SEU APP ESTARÁ NO AR EM ~10 MINUTOS!${NC}"
else
    echo -e "${RED}❌ ENCONTRADOS $ERRORS PROBLEMAS${NC}"
    echo ""
    echo -e "${YELLOW}🔧 CORRIJA OS PROBLEMAS ACIMA ANTES DO DEPLOY${NC}"
    echo ""
    echo -e "${BLUE}📚 DOCUMENTAÇÃO:${NC}"
    echo "- DEPLOY_GRATUITO.md"
    echo "- SETUP_OAUTH.md"
    echo "- README.md"
fi

exit $ERRORS
