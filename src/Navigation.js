import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return (
      <nav style={{
        padding: isMobile ? '0.3em' : '0.5em',
        justifyContent: 'center'
      }}>
        <Link className="menu-link" to="/login">Login</Link>
      </nav>
    );
  }

  return (
    <>
      {isMobile ? (
        // Layout Mobile
        <nav style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '0.3em',
          gap: 8
        }}>
          {/* Barra superior com botão de menu e usuário */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: '#444',
            borderRadius: 6
          }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ☰
            </button>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8
            }}>
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%' 
                  }}
                />
              )}
              <span style={{ color: '#fff', fontSize: 12 }}>
                {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                style={{
                  background: '#e3350d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 10,
                  cursor: 'pointer'
                }}
              >
                Sair
              </button>
            </div>
          </div>

          {/* Menu expandível */}
          {mobileMenuOpen && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              background: '#555',
              borderRadius: 6,
              padding: '8px'
            }}>
              <Link 
                className="menu-link" 
                to="/buscar-cartas"
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  margin: 0, 
                  padding: '10px 12px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              >
                Buscar
              </Link>
              <Link 
                className="menu-link" 
                to="/minha-galeria"
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  margin: 0, 
                  padding: '10px 12px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              >
                Minha Galeria
              </Link>
              <Link 
                className="menu-link" 
                to="/meus-decks"
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  margin: 0, 
                  padding: '10px 12px',
                  fontSize: '14px',
                  textAlign: 'center'
                }}
              >
                Meus Decks
              </Link>
            </div>
          )}
        </nav>
      ) : (
        // Layout Desktop
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 20,
          padding: '0.5em'
        }}>
          <Link className="menu-link" to="/buscar-cartas">Buscar</Link>
          <Link className="menu-link" to="/minha-galeria">Minha Galeria</Link>
          <Link className="menu-link" to="/meus-decks">Meus Decks</Link>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginLeft: 'auto',
            padding: '8px 16px',
            background: '#232323',
            borderRadius: 8
          }}>
            {user?.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name}
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%' 
                }}
              />
            )}
            <span style={{ color: '#fff', fontSize: 14 }}>
              Olá, {user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={logout}
              style={{
                background: '#e3350d',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

export default Navigation;