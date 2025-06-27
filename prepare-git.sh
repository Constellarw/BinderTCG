#!/bin/bash

# 🔧 SCRIPT PARA PREPARAR O GIT ANTES DO DEPLOY
echo "🔧 PREPARANDO GIT PARA DEPLOY..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 PREPARAÇÃO DO GIT PARA DEPLOY${NC}"
echo "==================================="

# 1. Verificar se é um repositório Git
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Não é um repositório Git!${NC}"
    echo -e "${YELLOW}🔧 Inicializando repositório...${NC}"
    git init
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
fi

# 2. Verificar se tem remote origin
if ! git remote -v | grep -q "origin"; then
    echo -e "${RED}❌ Remote origin não configurado!${NC}"
    echo ""
    echo -e "${YELLOW}📝 CONFIGURE O REMOTE ORIGIN:${NC}"
    echo "1. Vá ao GitHub.com"
    echo "2. Crie um novo repositório (ex: bindertcg)"
    echo "3. Execute o comando abaixo:"
    echo ""
    echo -e "${BLUE}git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git${NC}"
    echo ""
    read -p "Pressione ENTER após configurar o remote origin..."
    
    # Verificar novamente
    if ! git remote -v | grep -q "origin"; then
        echo -e "${RED}❌ Remote origin ainda não configurado!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Remote origin configurado${NC}"

# 3. Verificar branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Branch atual: $CURRENT_BRANCH${NC}"

# 4. Verificar se há alterações não commitadas
if git status --porcelain | grep -q .; then
    echo -e "${YELLOW}⚠️  Há alterações não commitadas${NC}"
    echo ""
    echo -e "${BLUE}📝 ARQUIVOS MODIFICADOS:${NC}"
    git status --short
    echo ""
    
    # Perguntar se quer commitar
    read -p "🤔 Deseja commitar essas alterações? (y/n): " commit_changes
    
    if [[ $commit_changes == "y" || $commit_changes == "Y" ]]; then
        echo -e "${YELLOW}📦 Adicionando arquivos...${NC}"
        git add .
        
        echo -e "${YELLOW}💬 Digite a mensagem do commit (ou ENTER para usar 'Preparação para deploy'):${NC}"
        read -p "Mensagem: " commit_message
        
        if [ -z "$commit_message" ]; then
            commit_message="Preparação para deploy - configuração backend e frontend"
        fi
        
        echo -e "${YELLOW}📝 Commitando...${NC}"
        git commit -m "$commit_message"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Commit realizado com sucesso${NC}"
        else
            echo -e "${RED}❌ Erro no commit${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Não é possível fazer deploy sem commitar as alterações${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Não há alterações não commitadas${NC}"
fi

# 5. Push para o repositório
echo -e "${YELLOW}🚀 Fazendo push para GitHub...${NC}"

# Verificar se a branch existe no remote
if git ls-remote --exit-code --heads origin $CURRENT_BRANCH > /dev/null 2>&1; then
    # Branch já existe no remote
    git push origin $CURRENT_BRANCH
else
    # Primeira vez fazendo push desta branch
    git push -u origin $CURRENT_BRANCH
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso${NC}"
else
    echo -e "${RED}❌ Erro no push${NC}"
    echo ""
    echo -e "${YELLOW}💡 POSSÍVEIS SOLUÇÕES:${NC}"
    echo "1. Verifique se o remote origin está correto:"
    echo "   git remote -v"
    echo ""
    echo "2. Verifique suas credenciais do GitHub"
    echo ""
    echo "3. Se for repositório privado, configure token de acesso"
    exit 1
fi

# 6. Verificar se o repositório está público
echo ""
echo -e "${BLUE}📋 VERIFICAÇÕES FINAIS${NC}"
echo "======================"

REMOTE_URL=$(git remote get-url origin)
echo -e "${BLUE}🔗 URL do repositório: $REMOTE_URL${NC}"

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "1. Verifique se o repositório no GitHub está PÚBLICO"
echo "2. Ou configure Deploy Keys se for privado"
echo ""

echo -e "${GREEN}🎉 GIT PREPARADO PARA DEPLOY!${NC}"
echo ""
echo -e "${BLUE}🚀 PRÓXIMOS PASSOS:${NC}"
echo "1. Verifique se o repositório está público no GitHub"
echo "2. Execute: ./check-deploy-gratuito.sh"
echo "3. Execute: ./deploy-gratuito.sh"
echo ""
echo -e "${GREEN}✨ SEU CÓDIGO ESTÁ PRONTO PARA DEPLOY!${NC}"
