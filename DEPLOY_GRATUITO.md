# 🚀 DEPLOY GRATUITO - RENDER + VERCEL

## 📋 PASSO A PASSO COMPLETO (100% GRATUITO)

### 🗄️ PARTE 1: Deploy do Backend no Render

#### 1.1 Preparar o Backend
```bash
# Verificar se o backend está pronto
cd backend
npm install
npm start # Deve rodar sem erros
```

#### 1.2 Criar conta no Render
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New +" → "Web Service"

#### 1.3 Configurar o Deploy
1. **Connect a repository**: Selecione seu repositório GitHub
2. **Root Directory**: `backend` (IMPORTANTE!)
3. **Environment**: `Node`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Plan**: Deixe "Free" selecionado

#### 1.4 Configurar Variáveis de Ambiente
**📍 ONDE ENCONTRAR O PAINEL:**

1. Após criar o Web Service, você será redirecionado para o **Dashboard do seu app**
2. Na barra lateral esquerda, clique em **"Environment"** 
3. Ou vá em: `https://dashboard.render.com/web/[SEU-APP-ID]` → aba **"Environment"**

**🔧 COMO ADICIONAR AS VARIÁVEIS:**

1. No painel "Environment", clique em **"Add Environment Variable"**
2. Adicione cada variável uma por vez:

```bash
# Adicione estas variáveis UMA POR VEZ:
Key: NODE_ENV          | Value: production
Key: PORT              | Value: 10000
Key: MONGODB_URI       | Value: mongodb+srv://seu-usuario:senha@cluster.mongodb.net/bindertcg
Key: GOOGLE_CLIENT_ID  | Value: seu-google-client-id
Key: GOOGLE_CLIENT_SECRET | Value: seu-google-client-secret
Key: JWT_SECRET        | Value: sua-jwt-secret-super-segura
Key: FRONTEND_URL      | Value: https://sua-app.vercel.app
```

**⚠️ APÓS ADICIONAR:** Clique em **"Save Changes"** - o app fará redeploy automático!

**📖 GUIA VISUAL DETALHADO:** Veja `RENDER_PAINEL_GUIA.md` para screenshots e passo-a-passo visual.

**⚠️ IMPORTANTE:** Anote a URL que o Render gerar (ex: `https://bindertcg-backend.onrender.com`)

---

### 🌐 PARTE 2: Deploy do Frontend na Vercel

#### 2.1 Configurar URLs de Produção
```bash
# Criar arquivo .env.production
echo "REACT_APP_API_URL=https://bindertcg-backend.onrender.com" > .env.production
```

#### 2.2 Atualizar CORS no Backend
Edite `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sua-app.vercel.app', // Adicione sua URL da Vercel aqui
];
```

#### 2.3 Deploy na Vercel
```bash
# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Fazer deploy
vercel --prod

# Ou usar o script automatizado
./deploy-production.sh
```

**⚠️ IMPORTANTE:** Anote a URL que a Vercel gerar (ex: `https://bindertcg.vercel.app`)

---

### 🔐 PARTE 3: Configurar OAuth do Google

#### 3.1 Google Cloud Console
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Vá em "APIs & Services" → "Credentials"
3. Edite seu OAuth Client ID
4. Adicione as URLs:

**Authorized JavaScript origins:**
```
https://bindertcg.vercel.app
```

**Authorized redirect URIs:**
```
https://sua-app.onrender.com/auth/google/callback
```

---

### ✅ PARTE 4: Testar Tudo

#### 4.1 Checklist de Teste
- [ ] Backend responde: `https://sua-app.onrender.com/api/health`
- [ ] Frontend carrega: `https://bindertcg.vercel.app`
- [ ] Login Google funciona
- [ ] Criar deck funciona
- [ ] Adicionar cartas funciona
- [ ] Galeria compartilhada funciona

#### 4.2 Troubleshooting Comum

**❌ CORS Error:**
```javascript
// backend/server.js - Adicione sua URL da Vercel
const allowedOrigins = [
  'https://bindertcg.vercel.app'
];
```

**❌ OAuth Error:**
- Verifique se as URLs no Google Console estão corretas
- Verifique se GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos

**❌ Database Error:**
- Verifique se MONGODB_URI está correto
- Verifique se IP está liberado no MongoDB Atlas (0.0.0.0/0)

---

## 💰 CUSTOS (100% GRATUITO!)

### Render (Backend)
- ✅ **Gratuito**: 750 horas/mês
- ✅ **Sleep após 15min**: Acordar automático
- ✅ **Custom domain**: Permitido

### Vercel (Frontend)
- ✅ **Gratuito**: 100GB bandwidth/mês
- ✅ **Custom domain**: Permitido
- ✅ **Deploys ilimitados**: Por push no GitHub

### MongoDB Atlas
- ✅ **Gratuito**: 512MB storage
- ✅ **Cluster compartilhado**: Suficiente para o projeto

---

## 🚀 DEPLOY EM 10 MINUTOS

```bash
# 1. Deploy Backend no Render (5 min)
# - render.com → New Web Service → GitHub → backend

# 2. Deploy Frontend na Vercel (2 min)
./deploy-production.sh

# 3. Configurar OAuth (3 min)
# - Google Console → Adicionar URLs
```

**🎯 Total: ~10 minutos para deploy completo!**

---

## 🚨 RESOLVENDO ERRO "Route not found"

### ❌ Problema
Se você acessar seu backend e ver:
```json
{"error":"Route not found"}
```

### 🔧 Solução (5 passos)

#### 1. Verificar Root Directory
1. No painel do Render, vá em **"Settings"**
2. Procure por **"Build & Deploy"**
3. Em **"Root Directory"** deve estar: `backend`
4. Se estiver vazio, clique **"Edit"** e digite: `backend`
5. Clique **"Save Changes"**

#### 2. Verificar Comandos
- **Build Command:** `npm install`
- **Start Command:** `npm start`

#### 3. Forçar Redeploy
1. Vá na aba **"Manual Deploy"**
2. Clique **"Deploy latest commit"**
3. Aguarde 2-5 minutos

#### 4. Testar com Script
```bash
# Execute o teste automático
./test-backend.sh
```

#### 5. Verificar Logs
1. Aba **"Logs"** no Render
2. Procure por erros ou warnings
3. Deve aparecer: `Server running on port 10000`

### ✅ Como Confirmar que Funcionou
Acesse no navegador:
```
https://seu-app.onrender.com/health
```

Deve retornar:
```json
{
  "status": "OK",
  "message": "BinderTCG Backend is running"
}
```

### 📞 Mais Ajuda
- Execute: `./check-backend.sh`
- Consulte: `RENDER_PAINEL_GUIA.md`
