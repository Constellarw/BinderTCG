import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        console.log('🔧 AuthContext: Inicializando...', { token: token ? 'Existe' : 'Não existe' });
        
        if (token) {
          try {
            const userData = await authService.getCurrentUser();
            console.log('🔧 AuthContext: Usuário carregado:', userData);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('🔧 AuthContext: Erro ao carregar usuário:', error);
            // Token inválido ou expirado
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.log('🔧 AuthContext: Nenhum token encontrado');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('🔧 AuthContext: Erro na inicialização:', error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('🔧 AuthContext: Inicialização completa');
      }
    };

    initAuth();
  }, []);

  const login = () => {
    authService.loginWithGoogle();
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAuthSuccess = async (token) => {
    console.log('🔧 AuthContext: handleAuthSuccess chamado com token:', token ? 'Existe' : 'Não existe');
    try {
      authService.handleAuthSuccess(token);
      const userData = await authService.getCurrentUser();
      console.log('🔧 AuthContext: Dados do usuário após login:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('🔧 AuthContext: Estado atualizado - isAuthenticated:', true);
    } catch (error) {
      console.error('🔧 AuthContext: Erro no handleAuthSuccess:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    handleAuthSuccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
