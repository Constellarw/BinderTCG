import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login, loading } = useAuth();

  const handleGoogleLogin = () => {
    login();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <section className="section" style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
      <h1>Bem-vindo ao BinderTCG</h1>
      <p>Entre com sua conta Google para acessar seus decks e coleção.</p>
      
      <div style={{ 
        background: '#232323', 
        borderRadius: 12, 
        padding: 32, 
        marginTop: 32 
      }}>
        <h2 style={{ marginBottom: 24, color: '#fff' }}>Fazer Login</h2>
        
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: '#4285f4',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 16,
            cursor: 'pointer',
            width: '100%',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#357ae8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4285f4'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>
        
        <div style={{ 
          marginTop: 24, 
          fontSize: 14, 
          color: '#aaa',
          lineHeight: 1.5 
        }}>
          Ao fazer login, você concorda com nossos termos de uso e política de privacidade.
        </div>
      </div>
      
      <div style={{ 
        marginTop: 32, 
        padding: 20, 
        background: '#181818', 
        borderRadius: 8 
      }}>
        <h3 style={{ color: '#fff', marginBottom: 16 }}>Por que fazer login?</h3>
        <ul style={{ 
          textAlign: 'left', 
          color: '#ccc',
          lineHeight: 1.6 
        }}>
          <li>💾 Salve seus decks na nuvem</li>
          <li>🎯 Acesse de qualquer dispositivo</li>
          <li>🎨 Personalize sua coleção</li>
          <li>🔄 Sincronização automática</li>
        </ul>
      </div>
    </section>
  );
}

export default Login;
