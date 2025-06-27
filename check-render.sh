#!/bin/bash

# 🔧 Checklist Rápido - Configurações do Render

echo "🔧 CHECKLIST RENDER - BinderTCG"
echo "==============================="
echo ""

echo "📋 VERIFICAÇÕES OBRIGATÓRIAS:"
echo ""

echo "1. 📁 ROOT DIRECTORY:"
echo "   ☐ No painel Render → Settings → Build & Deploy"
echo "   ☐ Root Directory = 'backend'"
echo "   ☐ NÃO deixe vazio!"
echo ""

echo "2. 🔧 BUILD & START COMMANDS:"
echo "   ☐ Build Command = 'npm install'"
echo "   ☐ Start Command = 'npm start'"
echo ""

echo "3. 🔐 VARIÁVEIS DE AMBIENTE (Environment):"
echo "   ☐ NODE_ENV = production"
echo "   ☐ PORT = 10000"
echo "   ☐ MONGODB_URI = sua-uri-completa"
echo "   ☐ JWT_SECRET = string-com-32+-caracteres"
echo "   ☐ SESSION_SECRET = string-diferente-do-jwt"
echo "   ☐ GOOGLE_CLIENT_ID = seu-id.apps.googleusercontent.com"
echo "   ☐ GOOGLE_CLIENT_SECRET = sua-secret"
echo "   ☐ FRONTEND_URL = https://sua-app.vercel.app"
echo ""

echo "4. 🔄 REDEPLOY:"
echo "   ☐ Após mudar configurações → Manual Deploy"
echo "   ☐ Deploy latest commit"
echo "   ☐ Aguardar 2-5 minutos"
echo ""

echo "5. ✅ TESTE FINAL:"
echo "   ☐ Acessar: https://seu-app.onrender.com/health"
echo "   ☐ Deve retornar: {\"status\":\"OK\",...}"
echo ""

echo "🚨 SE DER ERRO 'Route not found':"
echo "   1. Verificar ROOT DIRECTORY = 'backend'"
echo "   2. Fazer redeploy manual"
echo "   3. Aguardar deploy completo"
echo "   4. Testar novamente /health"
echo ""

echo "📞 SCRIPTS ÚTEIS:"
echo "   ./test-backend.sh      # Testar backend em produção"
echo "   ./check-backend.sh     # Diagnóstico completo"
echo ""

echo "📖 DOCUMENTAÇÃO:"
echo "   RENDER_PAINEL_GUIA.md  # Guia visual do painel"
echo "   DEPLOY_GRATUITO.md     # Passo a passo completo"
