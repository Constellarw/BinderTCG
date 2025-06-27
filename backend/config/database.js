const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI não configurado. Sistema funcionando em modo localStorage apenas.');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('⚠️  Sistema funcionando em modo localStorage apenas.');
    // Não encerrar o processo, apenas log do erro
  }
};

module.exports = connectDB;
