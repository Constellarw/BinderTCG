import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    BinderTCG
                    <img
                        src="https://www.shareicon.net/data/128x128/2016/12/13/863562_quick_512x512.png"
                        alt="Ícone relâmpago"
                        style={{ width: 32, height: 32, marginLeft: 8, verticalAlign: 'middle' }}
                    />
                </h1>
            </Link>
        </header>
    );
}
export default Header;