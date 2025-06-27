# 🎛️ GUIA VISUAL - PAINEL DO RENDER

## 📍 COMO ENCONTRAR O PAINEL DE VARIÁVEIS

### 🔗 Passo 1: Acessar o Dashboard
1. Vá para: [dashboard.render.com](https://dashboard.render.com)
2. Faça login com GitHub
3. Você verá a lista dos seus apps

### 📱 Passo 2: Entrar no seu App
1. Clique no **nome do seu app** (ex: "bindertcg-backend")
2. Você será redirecionado para: `https://dashboard.render.com/web/srv-XXXXXXXXX`

### ⚙️ Passo 3: Encontrar a Aba Environment
Na página do seu app, você verá várias abas no topo:

```
┌─────────────────────────────────────────────────────┐
│ [Overview] [Logs] [Environment] [Settings] [Events] │
└─────────────────────────────────────────────────────┘
```

**👆 Clique em "Environment"**

### 🔧 Passo 4: Adicionar Variáveis
Na página Environment, você verá:

```
┌─────────────────────────────────────────────────────┐
│ Environment Variables                                │
│                                                     │
│ [+ Add Environment Variable]                        │
│                                                     │
│ No environment variables configured                 │
└─────────────────────────────────────────────────────┘
```

**👆 Clique em "[+ Add Environment Variable]"**

### 📝 Passo 5: Preencher cada Variável
Um formulário aparecerá:

```
┌─────────────────────────────────────────────────────┐
│ Key:   [_________________________]                  │
│ Value: [_________________________]                  │
│                                                     │
│ [Cancel] [Add Variable]                             │
└─────────────────────────────────────────────────────┘
```

**Adicione uma por vez:**

1. **Primeira variável:**
   - Key: `NODE_ENV`
   - Value: `production`
   - Clique em **"Add Variable"**

2. **Segunda variável:**
   - Key: `PORT`
   - Value: `10000`
   - Clique em **"Add Variable"**

3. **Terceira variável:**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://seu-usuario:senha@cluster.mongodb.net/bindertcg`
   - Clique em **"Add Variable"**

4. **Quarta variável:**
   - Key: `GOOGLE_CLIENT_ID`
   - Value: `seu-google-client-id.apps.googleusercontent.com`
   - Clique em **"Add Variable"**

5. **Quinta variável:**
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: `seu-google-client-secret`
   - Clique em **"Add Variable"**

6. **Sexta variável:**
   - Key: `JWT_SECRET`
   - Value: `sua-jwt-secret-super-segura-com-pelo-menos-32-caracteres`
   - Clique em **"Add Variable"**

7. **Sétima variável (adicionar depois do deploy da Vercel):**
   - Key: `FRONTEND_URL`
   - Value: `https://sua-app.vercel.app`
   - Clique em **"Add Variable"**

### 💾 Passo 6: Salvar e Aguardar Deploy
1. Após adicionar todas as variáveis, clique em **"Save Changes"**
2. O Render fará **redeploy automático** (aguarde ~2-3 minutos)
3. Verifique se o deploy foi bem-sucedido na aba **"Logs"**

---

## ⚠️ DICAS IMPORTANTES

### 🔍 Como Verificar se Funcionou
1. Vá na aba **"Logs"** do seu app
2. Procure por linhas como:
   ```
   ✅ MongoDB Connected
   🚀 Server running on port 10000
   ```

### 🚨 Se Algo Der Errado
1. Vá na aba **"Logs"**
2. Procure por erros em vermelho
3. Corrija a variável com erro
4. O app fará redeploy automático

### 🔗 URL do seu Backend
Após o deploy bem-sucedido, sua URL será:
```
https://seu-app-name.onrender.com
```

**👆 ANOTE ESSA URL! Você vai precisar dela para configurar o frontend.**

---

## 🎯 CHECKLIST RÁPIDO

- [ ] Acessei dashboard.render.com
- [ ] Cliquei no meu app
- [ ] Fui na aba "Environment"
- [ ] Adicionei todas as 7 variáveis
- [ ] Cliquei em "Save Changes"
- [ ] Aguardei o redeploy (2-3 min)
- [ ] Verificei os logs (sem erros)
- [ ] Anotei a URL do backend

**🚀 Próximo passo: Deploy do frontend na Vercel!**

---

## 🚨 SOLUCIONANDO ERRO "Route not found"

### ❌ Problema Comum
Se você vir nos logs ou ao acessar a URL:
```
{"error":"Route not found"}
```

### 🔧 Configurações para Verificar

**1. Root Directory (MUITO IMPORTANTE):**
1. Vá na aba **"Settings"**
2. Role até **"Build & Deploy"**
3. Em **"Root Directory"** deve estar: `backend`
4. Se estiver vazio ou diferente, clique **"Edit"**
5. Digite: `backend`
6. Clique **"Save Changes"**

**2. Build Command:**
- Deve estar: `npm install`

**3. Start Command:**
- Deve estar: `npm start`

**4. Forçar Redeploy:**
1. Vá na aba **"Manual Deploy"**
2. Clique **"Deploy latest commit"**
3. Aguarde 2-5 minutos

### 🧪 Testando se Funcionou
Acesse no navegador:
```
https://seu-app.onrender.com/health
```

**Deve retornar:**
```json
{
  "status": "OK",
  "message": "BinderTCG Backend is running",
  "timestamp": "2024-...",
  "env": "production",
  "port": 10000
}
```

### 🌐 Testando Rota Raiz
Acesse:
```
https://seu-app.onrender.com/
```

**Deve retornar:**
```json
{
  "message": "BinderTCG Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "auth": "/auth/*",
    "decks": "/api/decks/*",
    "gallery": "/api/gallery/*"
  }
}
```

### 📞 Script de Diagnóstico
Execute no seu computador:
```bash
./check-backend.sh
```

Este script verifica configurações e testa o backend localmente.
