import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardPreview from './CardPreview';

const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";
const POKEMON_API_KEY = "ded63161-025b-4626-b221-a5bb93fa72ed";

function DeckView({ decks, onInspectCard, onRemoveCardFromDeck, onAddCardToDeck, onUpdateDeck }) {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const deck = decks.find(d => d.id === deckId || d._id === deckId);

  // Redireciona automaticamente se o deck não existir mais
  useEffect(() => {
    if (!deck) {
      navigate('/meus-decks', { replace: true });
    }
  }, [deck, navigate]);

  // Hooks DEVEM vir antes de qualquer return condicional!
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deckIconId, setDeckIconId] = useState(deck?.iconId || null);
  const [iconModalOpen, setIconModalOpen] = useState(false);

  // Novo estado para importação de deck por texto
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Novo estado para edição do nome
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(deck?.name || '');

  // Hook para detectar se é mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const gridRef = useRef();

  // Atualiza o ícone se o deck mudar
  useEffect(() => {
    setDeckIconId(deck?.iconId || null);
  }, [deck]);

  // Hook para detectar mudança no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função para buscar cartas
  const handleSearch = useCallback(async (e, nextPage = 1, keepResults = false) => {
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
      setHasMore((data.data || []).length === 20); 
      setPage(nextPage);
    } catch {
      setSearchResults([]);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm]);

  // Funções e hooks auxiliares
  const handleScroll = useCallback(() => {
    const grid = gridRef.current;
    if (!grid || isSearching || !hasMore) return;
    if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 10) {
      handleSearch(null, page + 1, true);
    }
  }, [isSearching, hasMore, page, handleSearch]);

  useEffect(() => {
    setSearchResults([]);
    setPage(1); 
    setHasMore(true);
    if (searchTerm) {
      handleSearch(null, 1, false);
    }
  }, [searchTerm, handleSearch]);

  if (!deck) return <div style={{ padding: 32 }}>Deck não encontrado.</div>;

  // Função para ordenar cartas seguindo as regras:
  // 1. Por tipo: Pokémon > Trainer > Energy
  // 2. Por quantidade: 4 > 3 > 2 > 1
  // 3. Por nome (alfabética) como critério final
  const sortCards = (cards) => {
    return [...cards].sort((a, b) => {
      const cardA = a.card;
      const cardB = b.card;
      
      // Definir prioridades por tipo
      const getTypePriority = (supertype) => {
        switch (supertype) {
          case 'Pokémon': return 1;
          case 'Trainer': return 2;
          case 'Energy': return 3;
          default: return 4;
        }
      };
      
      const priorityA = getTypePriority(cardA.supertype);
      const priorityB = getTypePriority(cardB.supertype);
      
      // Primeiro critério: tipo
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Segundo critério: quantidade (maior primeiro)
      if (a.quantity !== b.quantity) {
        return b.quantity - a.quantity;
      }
      
      // Terceiro critério: nome alfabético
      return cardA.name.localeCompare(cardB.name);
    });
  };

  // Agrupa cartas para sobreposição visual com ordenação aplicada
  const groupedCards = sortCards(deck.cards).map(item => ({
    card: item.card,
    quantity: item.quantity
  }));

  // Função para gerar o texto do deck
  function gerarTextoDeck(deck) {
    // Usar a mesma função de ordenação
    const sortedCards = sortCards(deck.cards);
    
    // Separar por tipo
    const pokemons = [];
    const trainers = [];
    const energys = [];
    
    sortedCards.forEach(item => {
      const { card } = item;
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
      const set = card.set?.id?.toUpperCase() || '';
      const num = card.number || '';
      // Só inclui set/num se ambos existirem
      if (set && num) {
        return `${quantity} ${card.name} ${set} ${num}`;
      }
      return `${quantity} ${card.name}`;
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

  // Função para definir o ícone do deck
  const handleSetDeckIcon = (cardId) => {
    setDeckIconId(cardId);
    setIconModalOpen(false);
    // Persistência opcional aqui
  };

  // Função para importar deck por texto
  const handleImportDeckText = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);

    // Pega apenas linhas de cartas (ignora cabeçalhos)
    const lines = importText.split('\n').map(l => l.trim()).filter(Boolean);
    const cardLines = lines.filter(line =>
      /^\d+\s+.+/.test(line) && !/^Pokémon:|^Trainer:|^Energy:/i.test(line)
    );

    let importedCards = [];
    for (const line of cardLines) {
      // Regex: quantidade, nome (pode ter espaços), set (opcional), número (opcional)
      // Ex: 4 Ethan's Ho-Oh ex DRI 39
      // Ex: 11 Fire Energy SVE 10
      // Ex: 8 Lightning Energy
      const match = line.match(/^(\d+)\s+(.+?)(?:\s+([A-Z0-9]+))?(?:\s+(\d+))?$/i);
      if (!match) continue;
      const quantity = parseInt(match[1], 10);
      let name = match[2].trim();
      let set = match[3] || '';
      let number = match[4] || '';

      // Se set e number não forem válidos, trata como só nome
      if (set && number && !/^[A-Z0-9]+$/.test(set)) {
        name = `${name} ${set} ${number}`.trim();
        set = '';
        number = '';
      } else if (set && !number && !/^[A-Z0-9]+$/.test(set)) {
        name = `${name} ${set}`.trim();
        set = '';
      }

      // Monta query para buscar carta exata
      let query = `name:"${name}"`;
      if (set) query += ` set.id:${set}`;
      if (number) query += ` number:${number}`;

      try {
        const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&pageSize=1`, {
          headers: { 'X-Api-Key': POKEMON_API_KEY }
        });
        const data = await response.json();
        const card = data.data && data.data[0];
        if (card) {
          importedCards.push({ card, quantity });
        }
      } catch (e) {
        // Falha ao buscar carta, ignora
      }
    }

    if (importedCards.length) {
      if (typeof onUpdateDeck === 'function') {
        onUpdateDeck({ ...deck, cards: importedCards });
        alert('Deck importado! As cartas foram substituídas.');
        setImportModalOpen(false); // Fecha o modal após importar com sucesso
      } else {
        alert('Importação não suportada: função de atualização não disponível.');
      }
    } else {
      alert('Nenhuma carta encontrada para importar.');
    }
    setIsImporting(false);
    setImportText('');
  };

  // Função para editar nome do deck
  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(deck.name);
  };

  const handleSaveName = () => {
    if (editedName.trim() && typeof onUpdateDeck === 'function') {
      onUpdateDeck({ ...deck, name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(deck.name);
  };

  // Função para excluir o deck
  const handleDeleteDeck = () => {
    if (window.confirm('Tem certeza que deseja excluir este deck?')) {
      if (typeof onUpdateDeck === 'function') {
        onUpdateDeck({ ...deck, _delete: true }); // Sinaliza para o App.js remover
      }
      navigate('/meus-decks'); // Volta para a lista de decks após excluir
    }
  };

  return (
    <>
      {/* Modal de seleção de ícone */}
      {iconModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIconModalOpen(false)}
        >
          <div
            style={{
              background: '#232323',
              borderRadius: 16,
              padding: isMobile ? 20 : 36,
              minWidth: isMobile ? '90vw' : 540,
              maxWidth: isMobile ? '90vw' : 'none',
              minHeight: isMobile ? 'auto' : 340,
              maxHeight: isMobile ? '80vh' : 'none',
              boxShadow: '0 2px 32px #000a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflowY: isMobile ? 'auto' : 'visible'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ 
              color: '#fff', 
              marginBottom: isMobile ? 16 : 24, 
              fontWeight: 400, 
              fontSize: isMobile ? 18 : 22,
              textAlign: 'center'
            }}>Escolha o ícone do deck</h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: isMobile ? 12 : 24, 
              justifyContent: 'center',
              maxHeight: isMobile ? '50vh' : 'none',
              overflowY: isMobile ? 'auto' : 'visible'
            }}>
              {groupedCards.map(({ card }) => (
                <div
                  key={card.id}
                  style={{
                    width: isMobile ? 80 : 120,
                    height: isMobile ? 112 : 168,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: card.id === deckIconId ? '3px solid #e3350d' : '3px solid transparent',
                    background: '#181818',
                    boxShadow: card.id === deckIconId ? '0 0 16px #e3350d88' : '0 2px 8px #0006',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border 0.2s'
                  }}
                  onClick={() => handleSetDeckIcon(card.id)}
                  title={card.name}
                >
                  <img
                    src={card.images?.large || card.images?.small || 'placeholder.png'}
                    alt={card.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              ))}
            </div>
            <button
              style={{
                marginTop: 32,
                background: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 28px',
                cursor: 'pointer',
                fontSize: 17
              }}
              onClick={() => setIconModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de importação de deck */}
      {importModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setImportModalOpen(false)}
        >
          <div
            style={{
              background: '#232323',
              borderRadius: 16,
              padding: isMobile ? 20 : 36,
              minWidth: isMobile ? '90vw' : 540,
              maxWidth: isMobile ? '90vw' : 'none',
              minHeight: isMobile ? 'auto' : 240,
              maxHeight: isMobile ? '80vh' : 'none',
              boxShadow: '0 2px 32px #000a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ 
              color: '#fff', 
              fontWeight: 400, 
              fontSize: isMobile ? 18 : 22, 
              marginBottom: 18,
              textAlign: 'center'
            }}>Importar deck por texto</h3>
            <textarea
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Cole aqui o texto do deck exportado..."
              rows={isMobile ? 6 : 8}
              style={{ 
                width: isMobile ? '100%' : 420, 
                borderRadius: 8, 
                padding: 8, 
                fontSize: 15, 
                marginBottom: 12, 
                background: '#181818', 
                color: '#fff', 
                border: '1px solid #444',
                minHeight: isMobile ? '120px' : 'auto',
                resize: 'vertical'
              }}
            />
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12,
              width: isMobile ? '100%' : 'auto'
            }}>
              <button
                onClick={handleImportDeckText}
                disabled={isImporting || !importText.trim()}
                style={{ 
                  background: '#3b4cca', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '8px 18px', 
                  cursor: 'pointer', 
                  fontSize: 15,
                  flex: isMobile ? '1' : 'none'
                }}
              >
                {isImporting ? 'Importando...' : 'Importar Deck'}
              </button>
              <button
                onClick={() => setImportModalOpen(false)}
                style={{ 
                  background: '#444', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 6, 
                  padding: '8px 18px', 
                  cursor: 'pointer', 
                  fontSize: 15,
                  flex: isMobile ? '1' : 'none'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão para abrir o modal de importação */}
      <div style={{ 
        marginBottom: 24, 
        background: '#232323', 
        borderRadius: 12, 
        padding: isMobile ? 12 : 16 
      }}>
        <button
          onClick={() => setImportModalOpen(true)}
          style={{ 
            background: '#3b4cca', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 6, 
            padding: isMobile ? '8px 16px' : '10px 22px', 
            cursor: 'pointer', 
            fontSize: isMobile ? 14 : 16,
            width: isMobile ? '100%' : 'auto'
          }}
        >
          Importar deck por texto
        </button>
      </div>

      {/* Botões de editar nome e excluir deck */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 12, 
        marginBottom: 16 
      }}>
        <button
          onClick={handleEditName}
          style={{ 
            background: '#444', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 6, 
            padding: isMobile ? '10px 18px' : '8px 18px', 
            cursor: 'pointer', 
            fontSize: 15,
            flex: isMobile ? 'none' : 'auto'
          }}
        >
          Editar nome
        </button>
        <button
          onClick={handleDeleteDeck}
          style={{ 
            background: '#e3350d', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 6, 
            padding: isMobile ? '10px 18px' : '8px 18px', 
            cursor: 'pointer', 
            fontSize: 15,
            flex: isMobile ? 'none' : 'auto'
          }}
        >
          Excluir deck
        </button>
      </div>

      <section
        className="section"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 20 : 40,
          alignItems: 'flex-start',
          background: 'none',
          boxShadow: 'none',
          border: 'none'
        }}
      >
        {/* Bloco do deck */}
        <div
          id="deckview-main"
          style={{
            flex: isMobile ? 'none' : 2,
            width: isMobile ? '100%' : 'auto',
            background: '#181818',
            borderRadius: 12,
            padding: isMobile ? 16 : 24,
            boxShadow: '0 2px 12px #0002',
            minWidth: 0,
          }}
        >
          <div className='name-deck' style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center', 
            gap: isMobile ? 12 : 18 
          }}>
            {/* Ícone do deck */}
            <div
              style={{
                width: isMobile ? 72 : 96,
                height: isMobile ? 100 : 134,
                borderRadius: 12,
                background: '#232323',
                border: '3px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}
              title="Selecionar ícone do deck"
              onClick={() => setIconModalOpen(true)}
            >
              {deckIconId ? (
                <img
                  src={
                    deck.cards.find(item => item.card.id === deckIconId)?.card.images?.large ||
                    deck.cards.find(item => item.card.id === deckIconId)?.card.images?.small ||
                    'placeholder.png'
                  }
                  alt="Ícone do deck"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              ) : (
                <span style={{ color: '#aaa', fontSize: 32 }}>+</span>
              )}
              {deckIconId && (
                <button
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    background: '#e3350d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}
                  title="Remover ícone"
                  onClick={e => {
                    e.stopPropagation();
                    setDeckIconId(null);
                  }}
                >×</button>
              )}
            </div>
            {isEditingName ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 8,
                alignItems: isMobile ? 'stretch' : 'center',
                width: '100%'
              }}>
                <input
                  type="text"
                  value={editedName}
                  onChange={e => setEditedName(e.target.value)}
                  style={{ 
                    fontSize: isMobile ? 16 : 18, 
                    padding: isMobile ? '12px 8px' : '4px 8px', 
                    borderRadius: 6, 
                    border: '1px solid #888',
                    flex: 1,
                    minHeight: isMobile ? '44px' : 'auto'
                  }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <div style={{
                  display: 'flex',
                  gap: 4,
                  flexDirection: isMobile ? 'row' : 'row'
                }}>
                  <button 
                    onClick={handleSaveName} 
                    style={{ 
                      padding: isMobile ? '10px 16px' : '8px 12px',
                      fontSize: isMobile ? '14px' : '16px',
                      minHeight: isMobile ? '44px' : 'auto',
                      flex: isMobile ? 1 : 'none'
                    }}
                  >
                    Salvar
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    style={{ 
                      padding: isMobile ? '10px 16px' : '8px 12px',
                      fontSize: isMobile ? '14px' : '16px',
                      minHeight: isMobile ? '44px' : 'auto',
                      flex: isMobile ? 1 : 'none'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <h2 style={{ 
                margin: 0,
                fontSize: isMobile ? '18px' : '22px',
                lineHeight: isMobile ? '1.3' : '1.2'
              }}>
                {deck.name} (
                {deck.cards.reduce((sum, item) => sum + item.quantity, 0)}/60
                )
              </h2>
            )}
          </div>
          {/* Botão de compartilhar */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12, 
            marginBottom: 8 
          }}>
            <button 
              onClick={handleCopyDeckText}
              style={{
                padding: isMobile ? '10px 16px' : '8px 16px',
                fontSize: isMobile ? '14px' : '16px',
                minHeight: isMobile ? '44px' : 'auto'
              }}
            >
              Copiar como texto
            </button>
          </div>
          <button 
            onClick={() => navigate('/meus-decks')} 
            style={{ 
              marginBottom: 16,
              padding: isMobile ? '10px 16px' : '8px 16px',
              fontSize: isMobile ? '14px' : '16px',
              minHeight: isMobile ? '44px' : 'auto'
            }}
          >
            ← Voltar
          </button>
          {groupedCards.length === 0 ? (
            <p>Este deck está vazio.</p>
          ) : (
            <div className="card-grid" style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? 'repeat(auto-fill, minmax(100px, 1fr))' 
                : 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: isMobile ? 8 : 12,
              justifyItems: 'center'
            }}>
              {groupedCards.map(({ card, quantity }) => (
                <div
                  key={card.id}
                  style={{
                    position: 'relative',
                    width: isMobile ? (80 + (quantity - 1) * 12) : (120 + (quantity - 1) * 20),
                    height: isMobile ? 112 : 168,
                    margin: '0 auto'
                  }}
                >
                  {[...Array(quantity)].map((_, idx) => (
                    <div
                      key={card.id + '-' + idx}
                      className={`deckview-card-stack${idx === quantity - 1 ? ' top' : ''}`}
                      style={{
                        position: 'absolute',
                        left: idx * (isMobile ? 12 : 20),
                        top: 0,
                        zIndex: idx + 1,
                        width: isMobile ? 80 : 120,
                        height: isMobile ? 112 : 168,
                        transition: 'transform 0.18s cubic-bezier(.4,2,.6,1)'
                      }}
                    >
                      <div
                        onClick={() => onInspectCard(card, false, false, true)}
                        className="deckview-card-hover"
                        style={{
                          width: isMobile ? 80 : 120,
                          height: isMobile ? 112 : 168,
                          borderRadius: 6,
                          display: 'block',
                          cursor: 'pointer'
                        }}
                      >
                        <img
                          src={card.images && card.images.small ? card.images.small : 'placeholder.png'}
                          alt=""
                          style={{ 
                            width: isMobile ? 80 : 120, 
                            height: isMobile ? 112 : 168, 
                            borderRadius: 6, 
                            display: 'block', 
                            pointerEvents: 'none' 
                          }}
                        />
                      </div>
                      {idx === quantity - 1 && (
                        <button
                          style={{
                            position: 'absolute', 
                            top: 3, 
                            right: 3,
                            background: '#e3350d', 
                            color: 'white', 
                            border: 'none',
                            borderRadius: '50%', 
                            width: isMobile ? 20 : 25, 
                            height: isMobile ? 20 : 25, 
                            cursor: 'pointer', 
                            zIndex: 10,
                            fontSize: isMobile ? '12px' : '14px'
                          }}
                          onClick={() => onRemoveCardFromDeck(deck._id || deck.id, card.id)}
                          title="Remover do Deck"
                        >×</button>
                      )}
                    </div>
                  ))}
                  {quantity > 1 && (
                    <span style={{
                      position: 'absolute',
                      bottom: isMobile ? 4 : 8,
                      right: isMobile ? 4 : 8,
                      background: '#222',
                      color: '#fff',
                      borderRadius: isMobile ? 6 : 8,
                      padding: isMobile ? '1px 4px' : '2px 8px',
                      fontSize: isMobile ? 11 : 13,
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
            flex: isMobile ? 'none' : 1.3,
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : 340,
            maxWidth: isMobile ? 'none' : 500,
            background: '#232323',
            borderRadius: 12,
            padding: isMobile ? 16 : 20,
            boxShadow: '0 2px 12px #0002',
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'auto' : 696,
            maxHeight: isMobile ? '500px' : '696px',
          }}
        >
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Buscar carta para adicionar"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                marginBottom: 8,
                padding: isMobile ? '8px' : '10px',
                fontSize: isMobile ? '14px' : '16px'
              }}
            />
            <button 
              type="submit" 
              disabled={isSearching || !searchTerm} 
              style={{ 
                width: '100%',
                padding: isMobile ? '8px' : '10px',
                fontSize: isMobile ? '14px' : '16px'
              }}
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          <div
            ref={gridRef}
            className="card-grid"
            style={{
              gap: isMobile ? 6 : 8,
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
              display: 'grid',
              overflowY: 'auto',
              marginBottom: 8,
              scrollbarWidth: 'thin',
              flex: 1
            }}
            onScroll={handleScroll}
          >
            {searchResults.map(card => (
              <div key={card.id} style={{ 
                position: 'relative', 
                width: isMobile ? 60 : 80, 
                height: isMobile ? 84 : 112 
              }}>
                <CardPreview
                  card={card}
                  onInspect={() => onInspectCard(card, false, false, true, deckId)}
                  style={{ 
                    width: isMobile ? 60 : 80, 
                    height: isMobile ? 84 : 112 
                  }}
                  hideName
                />
              </div>
            ))}
            {isSearching && (
              <div style={{ gridColumn: isMobile ? 'span 3' : 'span 4', textAlign: 'center', color: '#fff' }}>Carregando...</div>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}

export default DeckView;