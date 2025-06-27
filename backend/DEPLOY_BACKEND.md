# 🔧 CONFIGURAÇÃO DO BACKEND PARA PRODUÇÃO

## 📋 Checklist de Deploy do Backend

### 1. Preparar Variáveis de Ambiente (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://constellarw:PC8Va05L3vKqP18Z@cluster0.fiyatk1.mongodb.net/bindertcg?retryWrites=true&w=majority&appName=Cluster0
GOOGLE_CLIENT_ID=679850352703-maqa0pbdvc6qqabf088aps0v7ksjep3l.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
JWT_SECRET=NOVA_CHAVE_JWT_SUPER_SECRETA_PARA_PRODUCAO_ALTERE_ESTA
SESSION_SECRET=NOVA_CHAVE_SESSAO_SUPER_SECRETA_PARA_PRODUCAO_ALTERE_ESTA
FRONTEND_URL=https://seu-projeto.vercel.app
```

### 2. Opções de Deploy do Backend

#### A) Railway (Recomendado - Grátis)
```bash
# 1. Criar conta em railway.app
# 2. Conectar GitHub
# 3. Criar novo projeto
# 4. Deploy automático
```

#### B) Render (Grátis)
```bash
# 1. Criar conta em render.com
# 2. Conectar GitHub
# 3. Criar Web Service
# 4. Build: npm install
# 5. Start: npm start
```

#### C) Heroku (Pago)
```bash
# 1. Instalar Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Criar app
cd backend
heroku create seu-app-backend

# 4. Deploy
git push heroku main
```

### 3. Configurações de CORS para Produção

Atualize o arquivo `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://seu-projeto.vercel.app', // Frontend em produção
    process.env.FRONTEND_URL
  ],
  credentials: true
};
```

### 4. Configuração do Google OAuth

Adicione no Google Cloud Console:
- **Authorized JavaScript origins**: https://seu-projeto.vercel.app
- **Authorized redirect URIs**: https://seu-backend.railway.app/auth/google/callback

### 5. MongoDB Atlas - Configuração de Rede

1. Acesse MongoDB Atlas
2. Vá para "Network Access"
3. Adicione IP: `0.0.0.0/0` (ou IPs específicos dos serviços)

### 6. Comandos Úteis

```bash
# Testar backend local antes do deploy
cd backend
npm start

# Verificar conexão com MongoDB
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"

# Verificar variáveis de ambiente
node -e "require('dotenv').config(); console.log(process.env)"
```

### 7. Monitoramento

- **Railway**: dashboard.railway.app
- **Render**: dashboard.render.com  
- **Heroku**: dashboard.heroku.com

### 8. Logs de Debug

```javascript
// Adicionar no server.js para debug
console.log('Environment:', process.env.NODE_ENV);
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('MongoDB connected');
```

---

**Importante**: Altere as chaves JWT_SECRET e SESSION_SECRET para valores únicos e seguros em produção!
