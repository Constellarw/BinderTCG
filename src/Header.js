import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header style={{
            padding: isMobile ? '0.8em 1em' : '1em',
            textAlign: 'center'
        }}>
            <Link to="/" style={{ 
                color: 'inherit', 
                textDecoration: 'none', 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: isMobile ? 4 : 8,
                justifyContent: 'center'
            }}>
                <h1 style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: isMobile ? 4 : 8,
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    margin: 0
                }}>
                    BinderTCG
                    <img
                        src="https://www.shareicon.net/data/128x128/2016/12/13/863562_quick_512x512.png"
                        alt="Ícone relâmpago"
                        style={{ 
                            width: isMobile ? 24 : 32, 
                            height: isMobile ? 24 : 32, 
                            marginLeft: isMobile ? 4 : 8, 
                            verticalAlign: 'middle' 
                        }}
                    />
                </h1>
            </Link>
        </header>
    );
}
export default Header;