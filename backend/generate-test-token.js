const jwt = require('jsonwebtoken');
const User = require('./models/User');
const connectDB = require('./config/database');

async function generateTestToken() {
  try {
    await connectDB();
    
    // Buscar um usuário existente
    const user = await User.findOne();
    
    if (!user) {
      console.log('❌ Nenhum usuário encontrado no banco');
      return;
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    
    // Gerar token como o backend faz
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('🔑 Token gerado:');
    console.log(token);
    console.log('');
    console.log('💡 Use este token no header Authorization: Bearer <token>');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

generateTestToken();
