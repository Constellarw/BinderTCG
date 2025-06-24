import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link className="menu-link" to="/buscar-cartas">Buscar</Link>
      <Link className="menu-link" to="/minha-galeria">Minha Galeria</Link>
      <Link className="menu-link" to="/meus-decks">Meus Decks</Link>
    </nav>
  );
}

export default Navigation;