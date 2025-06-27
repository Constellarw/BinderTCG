# BinderTCG - Sistema de Coleção Pokémon com Google OAuth

Este projeto implementa um sistema completo para gerenciar coleções de cartas Pokémon, com autenticação via Google OAuth, banco de dados MongoDB e sincronização na nuvem.

## 🚀 Funcionalidades

- ✅ **Login com Google OAuth** - Autenticação segura
- ✅ **Banco de dados MongoDB** - Persistência de dados na nuvem
- ✅ **Gerenciamento de Decks** - Criar, editar, excluir decks
- ✅ **Galeria de Cartas** - Visualizar e organizar sua coleção
- ✅ **Sincronização** - Acesse seus dados de qualquer dispositivo
- ✅ **Busca de Cartas** - Integração com API Pokémon TCG
- ✅ **Responsivo** - Funciona em desktop e mobile

## 🛠️ Setup do Projeto

### Pré-requisitos

- Node.js 16+ 
- MongoDB (local ou Atlas)
- Conta Google Cloud Console

### 1. Configuração do Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a Google+ API
4. Vá em "Credenciais" → "Criar credenciais" → "ID do cliente OAuth 2.0"
5. Configure as URLs de origem autorizadas:
   - `http://localhost:3000` (frontend)
   - `http://localhost:5000` (backend)
6. Configure as URLs de redirecionamento autorizadas:
   - `http://localhost:5000/auth/google/callback`

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.example .env

# Editar o arquivo .env com suas credenciais:
# - GOOGLE_CLIENT_ID (do Google Cloud Console)
# - GOOGLE_CLIENT_SECRET (do Google Cloud Console)
# - MONGODB_URI (string de conexão do MongoDB)
# - JWT_SECRET (gerar uma string aleatória segura)
# - SESSION_SECRET (gerar uma string aleatória segura)
```

### 3. Configuração do Frontend

```bash
cd ..  # volta para a raiz do projeto

# Instalar dependências
npm install

# O arquivo .env já está configurado com:
# REACT_APP_API_URL=http://localhost:5000
```

### 4. Configuração do MongoDB

#### Opção A: MongoDB Local
```bash
# Instalar MongoDB Community Edition
# No Ubuntu/Debian:
sudo apt install mongodb

# Iniciar o serviço
sudo systemctl start mongodb

# No arquivo backend/.env usar:
MONGODB_URI=mongodb://localhost:27017/bindertcg
```

#### Opção B: MongoDB Atlas (Nuvem)
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um cluster
4. Configure um usuário de banco
5. Obtenha a string de conexão
6. No arquivo `backend/.env` usar:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/bindertcg
```

## 🚀 Executando o Projeto

### Backend
```bash
cd backend
npm run dev  # modo desenvolvimento com nodemon
# ou
npm start    # modo produção
```

### Frontend  
```bash
npm start
```

## 📁 Estrutura do Projeto

```
BinderTCG/
├── backend/                  # Servidor Node.js/Express
│   ├── config/              # Configurações (DB, Passport)
│   ├── middleware/          # Middlewares (auth, etc)
│   ├── models/              # Modelos MongoDB (User, Deck)
│   ├── routes/              # Rotas da API (auth, decks, gallery)
│   ├── .env                 # Variáveis de ambiente
│   └── server.js            # Arquivo principal do servidor
├── src/                     # Frontend React
│   ├── components/          # Componentes (Login, AuthSuccess)
│   ├── contexts/           # Context API (AuthContext)
│   ├── services/           # Serviços de API
│   └── ...                 # Outros componentes React
└── package.json            # Dependências do frontend
```

## 🔐 Fluxo de Autenticação

1. Usuário clica em "Login com Google"
2. Redirecionamento para OAuth do Google
3. Após autorização, Google redireciona para `/auth/google/callback`
4. Backend cria/atualiza usuário no MongoDB
5. Backend gera JWT token
6. Frontend recebe token e armazena
7. Requisições subsequentes incluem token no header

## 📊 API Endpoints

### Autenticação
- `GET /auth/google` - Iniciar login OAuth
- `GET /auth/google/callback` - Callback OAuth
- `GET /auth/me` - Obter usuário atual
- `GET /auth/logout` - Fazer logout

### Decks
- `GET /api/decks` - Listar decks do usuário
- `POST /api/decks` - Criar novo deck
- `GET /api/decks/:id` - Obter deck específico
- `PUT /api/decks/:id` - Atualizar deck
- `DELETE /api/decks/:id` - Excluir deck
- `POST /api/decks/:id/cards` - Adicionar carta ao deck
- `DELETE /api/decks/:id/cards/:cardId` - Remover carta do deck

## 🔧 Migração do localStorage

O sistema mantém compatibilidade com dados existentes no localStorage:
- Usuários não autenticados continuam usando localStorage
- Ao fazer login, dados podem ser migrados para o banco
- Fallback automático para localStorage em caso de erro

## 🛡️ Segurança

- ✅ CORS configurado
- ✅ Rate limiting 
- ✅ Helmet para headers de segurança
- ✅ JWT tokens com expiração
- ✅ Validação de dados de entrada
- ✅ Autenticação obrigatória para endpoints sensíveis

## 📱 URLs da Aplicação

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Login**: http://localhost:3000/login
- **Health Check**: http://localhost:5000/health

## 🎯 Próximos Passos

Para deploy em produção:

1. **Frontend**: Deploy no Vercel/Netlify
2. **Backend**: Deploy no Heroku/Railway/DigitalOcean
3. **Banco**: MongoDB Atlas
4. **Variáveis**: Configurar .env de produção
5. **OAuth**: Adicionar domínios de produção no Google Cloud

## 🐛 Resolução de Problemas

### "Cannot read property 'name' of undefined"
- Certifique-se que o backend está executando
- Verifique se o MongoDB está conectado
- Confirme as variáveis de ambiente

### Erro de OAuth
- Verifique GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
- Confirme URLs de callback no Google Cloud Console
- Certifique-se que as APIs estão habilitadas

### Erro de CORS
- Verifique FRONTEND_URL no backend/.env
- Confirme que ambos os servidores estão rodando

## 📄 Licença

MIT License - veja LICENSE para detalhes.
