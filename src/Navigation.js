import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link to="/buscar-cartas" className="menu-link">Buscar Cartas</Link>
            <Link to="/minha-galeria" className="menu-link">Minha Galeria</Link>
        </nav>
    );
}
export default Navigation;