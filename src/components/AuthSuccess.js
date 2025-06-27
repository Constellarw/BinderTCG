import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('🔑 AuthSuccess: Token recebido da URL:', token);
    console.log('🔑 AuthSuccess: Tamanho do token:', token ? token.length : 'Nulo');
    
    if (token) {
      console.log('🔑 AuthSuccess: Chamando handleAuthSuccess...');
      handleAuthSuccess(token);
      // Redirect to home or previous page
      navigate('/', { replace: true });
    } else {
      console.log('❌ AuthSuccess: Nenhum token encontrado na URL');
      // No token found, redirect to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, handleAuthSuccess, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 16 }}>🎉</div>
        <div>Login realizado com sucesso! Redirecionando...</div>
      </div>
    </div>
  );
}

export default AuthSuccess;
