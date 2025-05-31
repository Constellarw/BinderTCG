import React from 'react';

function Navigation({ setActiveView }) {
    return (
        <nav>
            <button onClick={() => setActiveView('search')}>Buscar Cartas</button>
            <button onClick={() => setActiveView('gallery')}>Minha Galeria</button>
        </nav>
    );
}
export default Navigation;