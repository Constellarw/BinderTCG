# 🔧 CONFIGURAÇÃO DE URLs PARA PRODUÇÃO

## 📋 CHECKLIST DE URLs A CONFIGURAR

### 1. 🚀 Após Deploy do Frontend na Vercel

Quando fizer deploy na Vercel, você receberá uma URL como:
```
https://bindertcg-abc123.vercel.app
```

**Anote esta URL** - você precisará dela para as próximas configurações.

### 2. 🔧 Após Deploy do Backend

Escolha uma opção e anote a URL do backend:

#### Railway (Recomendado):
```
https://bindertcg-backend-production.railway.app
```

#### Render:
```
https://bindertcg-backend.onrender.com
```

#### Heroku:
```
https://bindertcg-backend.herokuapp.com
```

### 3. 🔐 Google OAuth Console

1. Acesse: https://console.cloud.google.com
2. Vá para "APIs & Services" > "Credentials"
3. Clique no seu OAuth 2.0 Client ID
4. **Authorized JavaScript origins** - ADICIONE:
   ```
   https://bindertcg-abc123.vercel.app
   https://bindertcg-backend-production.railway.app
   ```

5. **Authorized redirect URIs** - ADICIONE:
   ```
   https://bindertcg-backend-production.railway.app/auth/google/callback
   ```

### 4. 📱 Vercel - Variáveis de Ambiente

Na Vercel Dashboard:
1. Vá para seu projeto
2. Settings > Environment Variables
3. Adicione:
   ```
   REACT_APP_API_URL = https://bindertcg-backend-production.railway.app
   ```

### 5. 🗄️ Backend - Variáveis de Ambiente

No serviço do backend (Railway/Render/Heroku):
1. Adicione as variáveis:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://bindertcg-abc123.vercel.app
   MONGODB_URI=mongodb+srv://constellarw:...
   GOOGLE_CLIENT_ID=679850352703-...
   GOOGLE_CLIENT_SECRET=GOCSPX-...
   JWT_SECRET=nova_chave_super_secreta_producao
   SESSION_SECRET=nova_chave_sessao_producao
   ```

### 6. 🔄 Atualizar CORS no Backend

Edite `backend/server.js` e adicione a URL da Vercel:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  'https://bindertcg-abc123.vercel.app' // ← Adicione sua URL aqui
];
```

### 7. 🗂️ MongoDB Atlas

1. Acesse: https://cloud.mongodb.com
2. Vá para "Network Access"
3. **Adicione IP** (se necessário):
   - Railway: IPs automáticos
   - Render: `0.0.0.0/0` (todos os IPs)
   - Heroku: IPs específicos do Heroku

### 8. ✅ Teste Final

Depois de todas as configurações:

1. **Teste Login**: https://bindertcg-abc123.vercel.app
2. **Teste API**: https://bindertcg-backend-production.railway.app/api/auth/status
3. **Teste OAuth**: Clique em "Login com Google"
4. **Teste Funcionalidades**: Criar deck, adicionar cartas, etc.

---

## 🚨 URLs IMPORTANTES PARA SUBSTITUIR

**Substitua estas URLs de exemplo pelas suas URLs reais:**

- `bindertcg-abc123.vercel.app` → **SUA URL DA VERCEL**
- `bindertcg-backend-production.railway.app` → **SUA URL DO BACKEND**

---

## 📞 TROUBLESHOOTING

### Problemas Comuns:

1. **CORS Error**:
   - Verifique se a URL da Vercel está no allowedOrigins
   - Verifique FRONTEND_URL no backend

2. **OAuth Error**:
   - Verifique URLs no Google Console
   - Verifique redirect URI

3. **API não funciona**:
   - Verifique REACT_APP_API_URL na Vercel
   - Verifique se backend está rodando

### Comandos para Debug:

```bash
# Testar backend
curl https://sua-url-backend.railway.app/api/auth/status

# Ver logs da Vercel
vercel logs --follow

# Ver logs do Railway
railway logs --follow
```

---

**🎉 Sucesso! Seu BinderTCG estará rodando em produção!**
