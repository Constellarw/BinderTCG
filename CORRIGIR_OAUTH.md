# Guia de Correção - Google OAuth "Acesso Bloqueado"

## Problema
Erro: "Acesso bloqueado: a solicitação desse app é inválida"

## Configurações Atuais
- **CLIENT_ID**: `679850352703-maqa0pbdvc6qqabf088aps0v7ksjep3l.apps.googleusercontent.com`
- **Frontend**: `http://localhost:3001`
- **Backend**: `http://localhost:5000`
- **Callback URL**: `http://localhost:5000/auth/google/callback`

## Passo a Passo para Corrigir

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/
- Selecione seu projeto ou crie um novo

### 2. Navegue para APIs & Services > Credentials
- No menu lateral: APIs & Services > Credentials
- Encontre seu OAuth 2.0 Client ID: `679850352703-maqa0pbdvc6qqabf088aps0v7ksjep3l`

### 3. Configure as Origens JavaScript Autorizadas
Adicione estas URLs exatas:
```
http://localhost:3001
http://localhost:5000
```

### 4. Configure os URIs de Redirecionamento Autorizados
Adicione esta URL exata:
```
http://localhost:5000/auth/google/callback
```

### 5. Configurar a Tela de Consentimento OAuth
- Vá para: APIs & Services > OAuth consent screen
- **User Type**: Escolha "External" (para desenvolvimento)
- **Application name**: BinderTCG
- **User support email**: Seu email
- **Developer contact email**: Seu email
- **Authorized domains**: Deixe vazio para localhost

### 6. Publicar a Aplicação (Importante!)
- Na tela de consentimento OAuth
- Clique em "PUBLISH APP" ou altere o status para "In production"
- Isso é crucial para localhost funcionar

### 7. Verificar Escopos
Certifique-se que estes escopos estão habilitados:
- `../auth/userinfo.email`
- `../auth/userinfo.profile`

### 8. Salvar e Aguardar
- Salve todas as configurações
- Aguarde 5-10 minutos para propagação

## Testando
Após as configurações, teste esta URL no navegador:
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=679850352703-maqa0pbdvc6qqabf088aps0v7ksjep3l.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=profile%20email
```

## Problemas Comuns

### Se ainda não funcionar:
1. **Verificar se o projeto está correto** - CLIENT_ID deve corresponder ao projeto
2. **Limpar cache do navegador** - OAuth usa cache extensivo
3. **Tentar navegador anônimo/incógnito**
4. **Verificar se a Google API está habilitada**:
   - APIs & Services > Library
   - Procurar "Google+ API" ou "People API"
   - Habilitar se necessário

### Alternativa: Criar novo OAuth Client
Se o problema persistir, crie um novo OAuth 2.0 Client ID:
1. APIs & Services > Credentials
2. Create Credentials > OAuth 2.0 Client ID
3. Application type: Web application
4. Name: BinderTCG-Local
5. Authorized JavaScript origins: `http://localhost:3001`, `http://localhost:5000`
6. Authorized redirect URIs: `http://localhost:5000/auth/google/callback`

## Comandos para Testar Após Configuração

```bash
# 1. Parar os serviços
cd /home/wislan/wis/BinderTCG
# No terminal do frontend: Ctrl+C
# No terminal do backend: Ctrl+C

# 2. Reiniciar backend
cd backend
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
