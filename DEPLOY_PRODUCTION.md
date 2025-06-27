# 🚀 GUIA DE DEPLOYMENT PARA PRODUÇÃO - VERCEL

Este guia irá te ajudar a fazer o deploy completo do BinderTCG para produção na Vercel, incluindo frontend React, backend Node.js, banco MongoDB Atlas e autenticação Google OAuth.

## 📋 PRÉ-REQUISITOS

### 1. Contas Necessárias:
- ✅ **Vercel Account** (para frontend)
- ✅ **Railway/Render/Heroku** (para backend Node.js)
- ✅ **MongoDB Atlas** (já configurado)
- ✅ **Google Cloud Console** (OAuth já configurado)

### 2. Arquivos Necessários:
- ✅ Frontend React funcionando localmente
- ✅ Backend Node.js funcionando localmente
- ✅ Variáveis de ambiente configuradas

## 🔧 CONFIGURAÇÃO DO BACKEND (PRODUÇÃO)

### Opção A: Railway (Recomendado)
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login no Railway
railway login

# 3. Criar projeto
railway new

# 4. Deploy do backend
cd backend
railway up
```

### Opção B: Render (Grátis)
1. Acesse [render.com](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um novo "Web Service"
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

## 🌐 CONFIGURAÇÃO DO FRONTEND (VERCEL)

### 1. Preparar o projeto para deploy:

```bash
# 1. Build do projeto
npm run build

# 2. Testar build localmente
npx serve -s build
```

### 2. Deploy na Vercel:

#### Via CLI:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

#### Via Dashboard:
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

## 🔐 VARIÁVEIS DE AMBIENTE

### Backend (Railway/Render):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://constellarw:PC8Va05L3vKqP18Z@cluster0.fiyatk1.mongodb.net/bindertcg?retryWrites=true&w=majority&appName=Cluster0
GOOGLE_CLIENT_ID=679850352703-maqa0pbdvc6qqabf088aps0v7ksjep3l.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=sua_chave_jwt_super_secreta_e_longa_aqui_mude_em_producao
SESSION_SECRET=sua_chave_sessao_super_secreta_aqui_mude_em_producao
FRONTEND_URL=https://seu-projeto.vercel.app
```

### Frontend (Vercel):
```env
REACT_APP_API_URL=https://seu-backend.railway.app
```

## 🔧 CONFIGURAÇÕES NECESSÁRIAS

### 1. Google OAuth - Adicionar URLs de Produção:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá para "APIs & Services" > "Credentials"
3. Edite seu OAuth 2.0 Client
4. Adicione nas **Authorized redirect URIs**:
   ```
   https://seu-backend.railway.app/auth/google/callback
   ```
5. Adicione nas **Authorized JavaScript origins**:
   ```
   https://seu-projeto.vercel.app
   https://seu-backend.railway.app
   ```

### 2. CORS - Configurar URLs de produção:

No arquivo `backend/server.js`, adicione as URLs de produção:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://seu-projeto.vercel.app', // URL do Vercel
    'https://seu-backend.railway.app'  // URL do Railway
  ],
  credentials: true
};
```

## 📁 ESTRUTURA DE ARQUIVOS

### Criar `vercel.json` (na raiz do projeto):
```json
{
  "name": "bindertcg",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Criar `.vercelignore`:
```
backend/
node_modules/
*.md
test-*.sh
debug-*.js
generate-test-token.js
```

## 🚀 PASSOS PARA DEPLOY

### 1. Preparar Backend:
```bash
cd backend
git add .
git commit -m "Prepare for production"
git push origin main
```

### 2. Deploy Backend (Railway):
```bash
railway up
# Anotar a URL gerada: https://seu-projeto-backend.railway.app
```

### 3. Atualizar Frontend:
```bash
# Atualizar .env com URL do backend
echo "REACT_APP_API_URL=https://seu-projeto-backend.railway.app" > .env

# Build e deploy
npm run build
vercel --prod
```

### 4. Configurar OAuth:
- Adicionar URLs de produção no Google Cloud Console
- Testar login em produção

### 5. Testar Funcionalidades:
- ✅ Login Google OAuth
- ✅ Criação de decks
- ✅ Adição de cartas
- ✅ Galeria compartilhada
- ✅ Sincronização com MongoDB

## 🔍 MONITORAMENTO

### Logs do Backend:
```bash
# Railway
railway logs

# Render
# Acesse o dashboard para ver logs
```

### Logs do Frontend:
```bash
# Vercel
vercel logs
```

## 🆘 TROUBLESHOOTING

### Problemas Comuns:

1. **CORS Error**: Verificar URLs nas configurações de CORS
2. **OAuth Error**: Verificar URLs autorizadas no Google Console
3. **Database Connection**: Verificar MongoDB Atlas allowlist
4. **Environment Variables**: Verificar se todas estão configuradas

### Comandos Úteis:
```bash
# Verificar status do deploy
vercel ls

# Ver logs em tempo real
vercel logs --follow

# Redeploy
vercel --prod --force
```

## 📝 CHECKLIST FINAL

- [ ] Backend deployed e funcionando
- [ ] Frontend deployed na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Google OAuth configurado para produção
- [ ] CORS configurado corretamente
- [ ] MongoDB Atlas acessível
- [ ] Teste completo de funcionalidades
- [ ] Monitoramento ativo

## 🔗 URLs IMPORTANTES

- **Frontend**: https://seu-projeto.vercel.app
- **Backend**: https://seu-projeto-backend.railway.app
- **MongoDB**: https://cloud.mongodb.com
- **Google Console**: https://console.cloud.google.com

---

**✨ Pronto! Seu BinderTCG estará rodando em produção!**
