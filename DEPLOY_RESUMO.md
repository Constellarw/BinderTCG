# 🚀 DEPLOY RÁPIDO - RESUMO DOS PASSOS

# 🚀 DEPLOY RÁPIDO - GRATUITO E FÁCIL

## 🎯 DEPLOY EM 3 PASSOS (100% GRATUITO)

### 1. ✅ Verificar se está tudo pronto
```bash
./check-deploy-gratuito.sh
```

### 2. � Deploy automático
```bash
./deploy-gratuito.sh
```

### 3. 🔐 Configurar OAuth
```bash
# Google Cloud Console:
# - Authorized JavaScript origins: https://sua-app.vercel.app
# - Authorized redirect URIs: https://sua-app.onrender.com/auth/google/callback
```

---

## �📋 ORDEM DE DEPLOY (IMPORTANTE!)

### 1. 🗄️ PRIMEIRO: Deploy do Backend (GRATUITO)
```bash
# Opção A: Render (Recomendado - GRATUITO)
# 1. Acesse render.com
# 2. Novo Web Service
# 3. Conecte GitHub/backend
# 4. Configure variáveis de ambiente
# 5. Deploy automático

# Opção B: Heroku (GRATUITO até 550h/mês)
# 1. Acesse heroku.com
# 2. Criar app
# 3. Git push para deploy
# 4. Configure config vars
# 5. Deploy manual

# Opção C: Vercel (para APIs Node.js - GRATUITO)
# 1. Deploy backend como Serverless Functions
# 2. Requer adaptação do código
```

**⚠️ ANOTE A URL DO BACKEND QUE FOR GERADA!**

### 2. 🌐 SEGUNDO: Configurar URLs
```bash
# 1. Edite .env.production com URL do backend
echo "REACT_APP_API_URL=https://sua-app.onrender.com" > .env.production

# 2. Atualize CORS no backend/server.js
# Adicione a URL da Vercel no allowedOrigins
```

### 3. 🚀 TERCEIRO: Deploy do Frontend
```bash
# Verificar se está tudo pronto
./check-deploy-gratuito.sh

# Deploy na Vercel
./deploy-gratuito.sh
```

**⚠️ ANOTE A URL DA VERCEL QUE FOR GERADA!**

### 4. 🔐 QUARTO: Configurar OAuth
```bash
# Google Cloud Console:
# 1. Authorized JavaScript origins: https://sua-url.vercel.app
# 2. Authorized redirect URIs: https://sua-app.onrender.com/auth/google/callback
```

### 5. ✅ QUINTO: Testar Tudo
```bash
# Teste as funcionalidades:
# - Login Google
# - Criar deck
# - Adicionar cartas
# - Galeria compartilhada
```

---

## 🛠️ SCRIPTS ÚTEIS

```bash
# Verificar se está pronto para deploy
./check-deploy-gratuito.sh

# Deploy automático gratuito
./deploy-gratuito.sh

# Build manual
npm run build

# Testar build local
npx serve -s build
```

---

## 💰 CUSTOS (100% GRATUITO!)

### ✅ Render (Backend)
- **750 horas/mês gratuitas**
- Sleep após 15min de inatividade
- Acordar automático em ~30s

### ✅ Vercel (Frontend)  
- **100GB bandwidth/mês**
- Deploys ilimitados
- Custom domain gratuito

### ✅ MongoDB Atlas
- **512MB storage gratuito**
- Cluster compartilhado
- Suficiente para o projeto

---

## 📞 PRECISA DE AJUDA?

1. **Leia primeiro**: `DEPLOY_GRATUITO.md`
2. **Configure URLs**: `CONFIGURAR_URLS_PRODUCAO.md`
3. **Backend**: `backend/DEPLOY_BACKEND.md`
4. **OAuth**: `SETUP_OAUTH.md`

---

## 🎯 RESUMO: 3 OPÇÕES DE DEPLOY

### 🆓 OPÇÃO 1: 100% GRATUITO (Recomendado)
```bash
# Backend: Render (gratuito)
# Frontend: Vercel (gratuito)
# Deploy automático: 
./deploy-gratuito.sh
```

### 💰 OPÇÃO 2: Render + Vercel
```bash
# Leia: DEPLOY_GRATUITO.md
# Deploy em 10 minutos
```

### 🚀 OPÇÃO 3: Manual
```bash
# Leia: DEPLOY_PRODUCTION.md
# Para usuários avançados
```

**🚀 Recomendação: Use ./deploy-gratuito.sh para deploy rápido e fácil!**
