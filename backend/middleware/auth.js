const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log('🔐 AUTH: Middleware chamado para:', req.method, req.originalUrl);
  
  try {
    // Check for token in header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔐 AUTH: Token encontrado:', token ? 'SIM' : 'NÃO');
    
    if (!token) {
      console.log('❌ AUTH: Nenhum token fornecido');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    console.log('🔐 AUTH: Verificando token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ AUTH: Token válido, userId:', decoded.userId);
    
    // Try to get user from database (if connected)
    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('❌ AUTH: Usuário não encontrado no banco');
        return res.status(401).json({ error: 'User not found' });
      }
      console.log('✅ AUTH: Usuário encontrado:', user.email);
      req.user = user;
    } catch (dbError) {
      // If database is not available, create a mock user from token
      console.log('⚠️ AUTH: Database not available, using token data');
      req.user = { _id: decoded.userId };
    }
    
    console.log('✅ AUTH: Middleware concluído, prosseguindo...');
    next();
  } catch (error) {
    console.error('❌ AUTH: Erro no middleware:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
