# 🔐 CORRIGINDO PROBLEMAS DE OAUTH

## ❌ Problema: "/auth/google" retorna "Not Found"

### 🔍 Possíveis Causas

1. **Variáveis de ambiente faltando**
2. **callbackURL incorreta no Passport**
3. **Rotas não carregadas corretamente**
4. **Google OAuth mal configurado**

---

## 🔧 SOLUÇÕES PASSO A PASSO

### 1. ✅ Verificar Variáveis de Ambiente no Render

No painel do Render → Environment, confirme que tem TODAS estas variáveis:

```
NODE_ENV = production
PORT = 10000
BACKEND_URL = https://sua-app.onrender.com
MONGODB_URI = mongodb+srv://...
GOOGLE_CLIENT_ID = seu-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = sua-secret
JWT_SECRET = sua-jwt-secret
SESSION_SECRET = sua-session-secret
FRONTEND_URL = https://sua-app.vercel.app
```

**⚠️ IMPORTANTE:** `BACKEND_URL` deve ser a URL do seu próprio backend no Render!

### 2. 🧪 Testar Rotas de Autenticação

Execute o script de teste:

```bash
./test-auth.sh
### 3. 🔄 Forçar Redeploy no Render

1. Painel Render → **"Manual Deploy"**
2. Clique **"Deploy latest commit"**
3. Aguarde 2-5 minutos
4. Verifique logs para erros

### 4. 📜 Verificar Logs no Render

1. Painel Render → **"Logs"**
2. Procure por:
   - `Loading routes...`
   - `Auth routes loaded`
   - Erros do Google Strategy
   - Erros de variáveis de ambiente

### 5. 🌐 Configurar Google Cloud Console

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edite seu OAuth 2.0 Client ID
4. Adicione as URLs:

**Authorized JavaScript origins:**
```
https://sua-app.vercel.app
```

**Authorized redirect URIs:**
```
https://sua-app.onrender.com/auth/google/callback
```

---

## 🔍 DIAGNÓSTICO AVANÇADO

### Verificar se Passport está configurado

No seu backend, acesse: `https://sua-app.onrender.com/auth/status`

**Resposta esperada:**
```json
{
  "message": "Auth routes working",
  "routes": ["/auth/google", "/auth/google/callback", "/auth/logout", "/auth/me"],
  "environment": "production",
  "googleClientId": "configured"
}
```

Se `googleClientId` estiver "missing", suas variáveis de ambiente não estão configuradas.

### Verificar callbackURL

A callbackURL no Passport deve mudar automaticamente entre:
- **Desenvolvimento:** `http://localhost:5000/auth/google/callback`
- **Produção:** `https://sua-app.onrender.com/auth/google/callback`

---

## 🚨 PROBLEMAS COMUNS

### ❌ "GOOGLE_CLIENT_ID não encontrado"
**Solução:** Adicionar variável no painel Render

### ❌ "Error: redirect_uri_mismatch"
**Solução:** Conferir URLs no Google Cloud Console

### ❌ "Cannot GET /auth/google"
**Solução:** Verificar se BACKEND_URL está configurado

### ❌ "OAuth2Strategy requires a clientID"
**Solução:** Verificar GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET

---

## ✅ TESTE FINAL

Após corrigir tudo:

1. Acesse: `https://sua-app.onrender.com/auth/google`
2. Deve redirecionar para Google
3. Após login, deve voltar para seu frontend

---

## 🛠️ SCRIPTS ÚTEIS

```bash
./test-auth.sh        # Teste específico de autenticação
./test-backend.sh     # Teste geral do backend
./check-backend.sh    # Diagnóstico completo
```

---

## 📞 AINDA COM PROBLEMAS?

1. Execute: `./test-auth.sh`
2. Copie a saída e logs do Render
3. Consulte `DEPLOY_GRATUITO.md`
4. Verifique `RENDER_PAINEL_GUIA.md`
npm run dev

# 3. Reiniciar frontend (novo terminal)
cd ..
npm start

# 4. Testar login
# Abrir http://localhost:3001 e tentar fazer login
```

## Verificação Final
Após seguir todos os passos:
1. ✅ Origens JavaScript configuradas
2. ✅ URIs de redirecionamento configurados  
3. ✅ Aplicação publicada
4. ✅ Cache do navegador limpo
5. ✅ Serviços reiniciados

O login OAuth deve funcionar normalmente.
