import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Decks({ decks, onCreateDeck }) {
  const [newDeckName, setNewDeckName] = useState('');

  return (
    <section className="section">
      <h2>Meus Decks</h2>
      <form onSubmit={e => { e.preventDefault(); onCreateDeck(newDeckName); setNewDeckName(''); }}>
        <input
          type="text"
          placeholder="Nome do novo deck"
          value={newDeckName}
          onChange={e => setNewDeckName(e.target.value)}
          required
        />
        <button type="submit">Criar Deck</button>
      </form>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
        {decks.map(deck => (
          <Link
            key={deck._id || deck.id}
            to={`/meus-decks/${deck._id || deck.id}`}
            style={{
              display: 'block',
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: 12,
              textDecoration: 'none',
              color: 'inherit',
              width: 180,
              textAlign: 'center',
              background: '#222',
            }}
          >
            {deck.cards.length > 0 ? (
              <img
                src={deck.cards[0].card.images?.small || 'placeholder.png'}
                alt={deck.cards[0].card.name}
                style={{ width: 120, height: 168, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
              />
            ) : (
              <div style={{
                width: 120, height: 168, background: '#444', borderRadius: 6, margin: '0 auto 8px auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 14
              }}>
                Sem cartas
              </div>
            )}
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{deck.name}</div>
            <div style={{ fontSize: 14, color: '#aaa' }}>
              {deck.cards.reduce((sum, item) => sum + item.quantity, 0)}/60 cartas
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Decks;