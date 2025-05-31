import React, { useState } from 'react';

function SearchBar({ onSearch, initialTerm }) {
    const [inputValue, setInputValue] = useState(initialTerm || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(inputValue.trim(), 1); // Busca na primeira página ao submeter novo termo
    };

    return (
        <form id="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite o nome de um Pokémon..."
            />
            <button type="submit">Buscar</button>
        </form>
    );
}
export default SearchBar;