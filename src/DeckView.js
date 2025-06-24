import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardPreview from './CardPreview';
import html2canvas from 'html2canvas'; // Instale: npm install html2canvas

const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";
const POKEMON_API_KEY = "ded63161-025b-4626-b221-a5bb93fa72ed";

function DeckView({ decks, onInspectCard, onRemoveCardFromDeck }) {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const deck = decks.find(d => d.id === deckId);

  // Hooks DEVEM vir antes de qualquer return condicional!
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const gridRef = useRef();

  // Funções e hooks auxiliares
  const handleScroll = useCallback(() => {
    const grid = gridRef.current;
    if (!grid || isSearching || !hasMore) return;
    if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 10) {
      handleSearch(null, page + 1, true);
    }
  }, [isSearching, hasMore, page, searchTerm]);

  useEffect(() => {
    setSearchResults([]);
    setPage(1); 
    setHasMore(true);
    if (searchTerm) {
      handleSearch(null, 1, false);
    }
    // eslint-disable-next-line
  }, [searchTerm]);

  if (!deck) return <div style={{ padding: 32 }}>Deck não encontrado.</div>;

  // Agrupa cartas para sobreposição visual
  const groupedCards = deck.cards.map(item => ({
    card: item.card,
    quantity: item.quantity
  }));

  // Função para buscar cartas
  const handleSearch = async (e, nextPage = 1, keepResults = false) => {
    if (e) e.preventDefault();
    if (!searchTerm) return;
    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}?q=name:"${searchTerm}*"&page=${nextPage}&pageSize=20`, {
        headers: { 'X-Api-Key': POKEMON_API_KEY }
      });
      const data = await response.json();
      if (keepResults) {
        setSearchResults(prev => [...prev, ...(data.data || [])]);
      } else {
        setSearchResults(data.data || []);
      }
      setHasMore((data.data || []).length === 20); // Se vier menos que 20, acabou
      setPage(nextPage);
    } catch {
      setSearchResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Função para gerar o texto do deck
  function gerarTextoDeck(deck) {
    // Separe por tipo
    const pokemons = [];
    const trainers = [];
    const energys = [];
    deck.cards.forEach(item => {
      const { card, quantity } = item;
      if (card.supertype === "Pokémon") {
        pokemons.push({ ...item });
      } else if (card.supertype === "Trainer") {
        trainers.push({ ...item });
      } else if (card.supertype === "Energy") {
        energys.push({ ...item });
      }
    });

    function formatLine(item) {
      const { card, quantity } = item;
      // Exemplo: 4 Team Rocket's Tarountula DRI 19
      const set = card.set?.id?.toUpperCase() || '';
      const num = card.number || '';
      return `${quantity} ${card.name} ${set} ${num}`.trim();
    }

    let texto = '';
    if (pokemons.length) {
      texto += `Pokémon: ${pokemons.reduce((a, b) => a + b.quantity, 0)}\n`;
      texto += pokemons.map(formatLine).join('\n') + '\n\n';
    }
    if (trainers.length) {
      texto += `Trainer: ${trainers.reduce((a, b) => a + b.quantity, 0)}\n`;
      texto += trainers.map(formatLine).join('\n') + '\n\n';
    }
    if (energys.length) {
      texto += `Energy: ${energys.reduce((a, b) => a + b.quantity, 0)}\n`;
      texto += energys.map(formatLine).join('\n');
    }
    return texto.trim();
  }

  // Função para copiar texto
  const handleCopyDeckText = () => {
    const texto = gerarTextoDeck(deck);
    navigator.clipboard.writeText(texto)
      .then(() => alert('Deck copiado como texto!'))
      .catch(() => alert('Erro ao copiar texto.'));
  };

  // Função para tirar print do deck
  const handleShareDeckImage = async () => {
    const printDiv = document.getElementById('deckview-print');
    if (!printDiv) return;
    const canvas = await html2canvas(printDiv, { backgroundColor: '#222' });
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deck.name.replace(/\s+/g, '_')}_deck.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const renderPrintGrid = () => (
    <div
      id="deckview-print"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: 800,
        background: '#222',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 80px)',
        gap: 8,
        zIndex: -1
      }}
    >
      {groupedCards.flatMap(({ card, quantity }) =>
        Array.from({ length: quantity }).map((_, idx) => (
          <img
            key={card.id + '-' + idx}
            src={card.images && card.images.small ? card.images.small : 'placeholder.png'}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: 80,
              height: 112,
              borderRadius: 6,
              background: '#181818',
              objectFit: 'cover'
            }}
          />
        ))
      ).slice(0, 60)}
    </div>
  );

  return (
    <>
      {renderPrintGrid()}
      <section
        className="section"
        style={{
          display: 'flex',
          gap: 40,
          alignItems: 'flex-start',
          background: 'none',
          boxShadow: 'none',
          border: 'none'
        }}
      >
        {/* Bloco do deck */}
        <div
          id="deckview-main" // <-- Para print
          style={{
            flex: 2,
            background: '#181818',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 12px #0002',
            minWidth: 0,
          }}
        >
          {/* Botão de compartilhar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <button onClick={handleCopyDeckText}>Copiar como texto</button>
            <button onClick={handleShareDeckImage}>Compartilhar imagem do deck</button>
          </div>
          <button onClick={() => navigate('/meus-decks')} style={{ marginBottom: 16 }}>← Voltar</button>
          <h2>
            {deck.name} (
            {deck.cards.reduce((sum, item) => sum + item.quantity, 0)}/60
            )
          </h2>
          {groupedCards.length === 0 ? (
            <p>Este deck está vazio.</p>
          ) : (
            <div className="card-grid">
              {groupedCards.map(({ card, quantity }) => (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                    width: 120 + (quantity - 1) * 20,
                    height: 168,
                    margin: '0 auto'
                  }}
                >
                  {[...Array(quantity)].map((_, idx) => (
                    <div
                      key={card.id + '-' + idx}
                      className={`deckview-card-stack${idx === quantity - 1 ? ' top' : ''}`}
                      style={{
                        position: 'absolute',
                        left: idx * 20,
                        top: 0,
                        zIndex: idx + 1,
                        width: 120,
                        height: 168,
                        transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)'
                      }}
                    >
                      <div
                        onClick={() => onInspectCard(card, false, false, true)}
                        className="deckview-card-hover"
                        style={{
                          width: 120,
                          height: 168,
                          borderRadius: 6,
                          display: 'block',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={card.images && card.images.small ? card.images.small : 'placeholder.png'}
                          alt=""
                          style={{ width: 120, height: 168, borderRadius: 6, display: 'block', pointerEvents: 'none' }}
                        />
                      </div>
                      {idx === quantity - 1 && (
                        <button
                          style={{
                            position: 'absolute', top: 5, right: 5,
                            background: '#e3350d', color: 'white', border: 'none',
                            borderRadius: '50%', width: 25, height: 25, cursor: 'pointer', zIndex: 10
                          }}
                          onClick={() => onRemoveCardFromDeck(deck.id, card.id)}
                          title="Remover do Deck"
                        >X</button>
                      )}
                    </div>
                  ))}
                  {quantity > 1 && (
                    <span style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: '#222',
                      color: '#fff',
                      borderRadius: 8,
                      padding: '2px 8px',
                      fontSize: 13,
                      opacity: 0.85,
                      zIndex: 20
                    }}>
                      x{quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Bloco lateral da busca */}
        <aside
          style={{
            flex: 1.3,
            minWidth: 340,
            background: '#232323',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 2px 12px #0002',
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            height: 470,
          }}
        >
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Buscar carta para adicionar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <button type="submit" disabled={isSearching || !searchTerm} style={{ width: '100%' }}>
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          <div
            ref={gridRef}
            className="card-grid"
            style={{
              gap: 8,
              gridTemplateColumns: 'repeat(4, 1fr)',
              display: 'grid',
              maxHeight: 240,
              overflowY: 'auto',
              marginBottom: 8,
              scrollbarWidth: 'thin'
            }}
            onScroll={handleScroll}
          >
            {searchResults.map(card => (
              <div key={card.id} style={{ position: 'relative', width: 80, height: 112 }}>
                <CardPreview
                  card={card}
                  onInspect={() => onInspectCard(card, false, false, true, deckId)}
                  style={{ width: 80, height: 112 }}
                  hideName
                />
              </div>
            ))}
            {isSearching && (
              <div style={{ gridColumn: 'span 4', textAlign: 'center', color: '#fff' }}>Carregando...</div>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}

export default DeckView;