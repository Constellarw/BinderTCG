import React from 'react';

function Footer() {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} Minha Coleção Pokémon. Efeitos de CSS por <a href="https://github.com/simeydotme/pokemon-cards-css" target="_blank" rel="noopener noreferrer">simeydotme</a>.</p>
            <p>API de cartas por <a href="https://pokemontcg.io/" target="_blank" rel="noopener noreferrer">PokemonTCG.io</a>.</p>
        </footer>
    );
}
export default Footer;