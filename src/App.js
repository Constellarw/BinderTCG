import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './Header';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import CardList from './CardList';
import Gallery from './Gallery';
import SharedGallery from './SharedGallery';
import CardInspectorModal from './CardInspectorModal';
import Footer from './Footer';
import Decks from './Decks';
import DeckView from './DeckView';
import Login from './components/Login';
import AuthSuccess from './components/AuthSuccess';
import { deckService, galleryService, authService } from './services/api';
import './App.css';

const POKEMON_API_KEY = "ded63161-025b-4626-b221-a5bb93fa72ed";
const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";

// Novo componente Home
function Home() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Carregando...</div>
      </div>
    );
  }
  
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <h1>Bem-vindo à sua Coleção Pokémon!</h1>
      <p>Gerencie, busque e compartilhe suas cartas Pokémon favoritas.</p>
      
      {!isAuthenticated ? (
        <div style={{ marginTop: '2rem' }}>
          <Login />
        </div>
      ) : (
        <div style={{ marginTop: '2rem', color: 'green' }}>
          ✅ Você está logado!
        </div>
      )}
    </section>
  );
}

function AppContent() {
    const { isAuthenticated, loading } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [darkMode] = useState(false);
    const [isAddingToGallery, setIsAddingToGallery] = useState(false);
    
    // Migração gradual: usar localStorage como fallback
    const [myGalleryItems, setMyGalleryItems] = useState(() => {
        const saved = localStorage.getItem('pokemonGallery');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [galleryLoaded, setGalleryLoaded] = useState(false);
    
    // Para decks, agora usaremos o backend se autenticado
    const [myDecks, setMyDecks] = useState([]);
    
    const [isFromDeckView, setIsFromDeckView] = useState(false);
    const [inspectedDeckId, setInspectedDeckId] = useState(null);
    const location = useLocation();

    // Carregar decks do backend se autenticado
    useEffect(() => {
        const loadDecks = async () => {
            console.log('🎯 DEBUG: Estado atual - isAuthenticated:', isAuthenticated, 'loading:', loading);
            
            if (isAuthenticated && !loading) {
                try {
                    console.log('🎯 DECK: Carregando decks do backend...');
                    const decks = await deckService.getDecks();
                    console.log('✅ DECK: Decks carregados do backend:', decks);
                    
                    // Se não há decks no backend mas há no localStorage, migrar
                    const localDecks = localStorage.getItem('pokemonDecks');
                    if (decks.length === 0 && localDecks) {
                        console.log('🔄 DECK: Migrando decks do localStorage para o backend...');
                        const localDecksArray = JSON.parse(localDecks);
                        
                        for (const localDeck of localDecksArray) {
                            try {
                                const migratedDeck = await deckService.createDeck(localDeck.name);
                                console.log('✅ DECK: Deck migrado:', localDeck.name);
                                
                                // Migrar cartas do deck
                                for (const cardItem of localDeck.cards || []) {
                                    try {
                                        await deckService.addCardToDeck(migratedDeck._id, cardItem.card, cardItem.quantity);
                                        console.log('✅ DECK: Carta migrada:', cardItem.card.name);
                                    } catch (error) {
                                        console.error('❌ DECK: Erro ao migrar carta:', error);
                                    }
                                }
                            } catch (error) {
                                console.error('❌ DECK: Erro ao migrar deck:', error);
                            }
                        }
                        
                        // Recarregar decks após migração
                        const updatedDecks = await deckService.getDecks();
                        setMyDecks(updatedDecks);
                        console.log('✅ DECK: Migração concluída');
                    } else {
                        setMyDecks(decks);
                    }
                } catch (error) {
                    console.error('❌ DECK: Erro ao carregar decks:', error);
                    // Fallback para localStorage
                    const saved = localStorage.getItem('pokemonDecks');
                    if (saved) {
                        console.log('🔄 DECK: Usando fallback localStorage');
                        const localDecks = JSON.parse(saved);
                        setMyDecks(localDecks);
                    }
                }
            } else if (!isAuthenticated && !loading) {
                // Não autenticado, usar localStorage
                console.log('🔄 DECK: Não autenticado, carregando do localStorage');
                const saved = localStorage.getItem('pokemonDecks');
                if (saved) {
                    const localDecks = JSON.parse(saved);
                    console.log('📂 DECK: Decks encontrados no localStorage:', localDecks);
                    setMyDecks(localDecks);
                }
            }
        };

        loadDecks();
    }, [isAuthenticated, loading]);

    useEffect(() => {
        const loadGallery = async () => {
            if (isAuthenticated && !loading) {
                try {
                    console.log('🎴 Carregando galeria do backend...');
                    const gallery = await galleryService.getGallery();
                    console.log('✅ Galeria carregada do backend:', gallery);
                    
                    // Se a galeria do backend está vazia mas há cartas no localStorage,
                    // migrar as cartas do localStorage para o backend
                    const localGallery = localStorage.getItem('pokemonGallery');
                    if ((!gallery.cards || gallery.cards.length === 0) && localGallery) {
                        console.log('🔄 Migrando cartas do localStorage para o backend...');
                        const localCards = JSON.parse(localGallery);
                        
                        for (const item of localCards) {
                            try {
                                await galleryService.addCardToGallery(item.card || item, '');
                                console.log('✅ Carta migrada:', (item.card || item).name);
                            } catch (error) {
                                console.error('❌ Erro ao migrar carta:', error);
                            }
                        }
                        
                        // Recarrega a galeria após migração
                        const updatedGallery = await galleryService.getGallery();
                        setMyGalleryItems(updatedGallery.cards || []);
                        console.log('✅ Migração concluída');
                    } else {
                        setMyGalleryItems(gallery.cards || []);
                    }
                } catch (error) {
                    console.error('❌ Erro ao carregar galeria do backend:', error);
                    // Fallback para localStorage se backend falhar
                    const storedGallery = localStorage.getItem('pokemonGallery');
                    if (storedGallery) {
                        setMyGalleryItems(JSON.parse(storedGallery));
                    }
                }
            } else if (!isAuthenticated && !loading) {
                // Não autenticado, usar localStorage
                const storedGallery = localStorage.getItem('pokemonGallery');
                if (storedGallery) {
                    setMyGalleryItems(JSON.parse(storedGallery));
                }
            }
            setGalleryLoaded(true);
        };

        loadGallery();
    }, [isAuthenticated, loading]);

    useEffect(() => {
        localStorage.setItem('pokemonGallery', JSON.stringify(myGalleryItems));
    }, [myGalleryItems]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleSearch = async (newSearchTerm, page = 1) => {
        if (!newSearchTerm && !searchTerm && page === 1) {
            setSearchResults([]);
            setTotalPages(1);
            setCurrentPage(1);
            return;
        }
        
        const termToSearch = newSearchTerm || searchTerm;
        if (!termToSearch) return;

        setIsLoading(true);
        setSearchTerm(termToSearch); // Garante que o termo está atualizado para paginação
        try {
            const response = await fetch(`${API_BASE_URL}?q=name:"${termToSearch}*"&page=${page}&pageSize=20`, {
                headers: { 'X-Api-Key': POKEMON_API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setSearchResults(data.data || []);
            setCurrentPage(data.page || 1);
            setTotalPages(Math.ceil((data.totalCount || 0) / (data.pageSize || 20)));
        } catch (error) {
            console.error("Erro ao buscar cartas:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInspectCard = (card, adding = false, shared = false, fromDeckView = false, deckId = null) => {
      setSelectedCard(card);
      setIsModalOpen(true);
      setIsAddingToGallery(adding);
      setIsFromDeckView(fromDeckView);
      setInspectedDeckId(deckId);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleAddToGallery = async (card, quantity = 1) => {
        // Se autenticado, salva no backend
        if (isAuthenticated) {
            try {
                console.log('🎴 Adicionando carta ao backend:', card.name);
                await galleryService.addCardToGallery(card, '');
                console.log('✅ Carta adicionada ao backend com sucesso');
                // Após salvar no backend, recarrega a galeria
                const updatedGallery = await galleryService.getGallery();
                setMyGalleryItems(updatedGallery.cards || []);
            } catch (error) {
                console.error('❌ Erro ao adicionar carta ao backend:', error);
                // Fallback para localStorage se backend falhar
                setMyGalleryItems(prev => {
                    const existing = prev.find(item => item.card.id === card.id);
                    if (existing) {
                        return prev.map(item =>
                            item.card.id === card.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    }
                    return [...prev, { card, quantity }];
                });
            }
        } else {
            // Se não autenticado, salva apenas no localStorage
            setMyGalleryItems(prev => {
                const existing = prev.find(item => item.card.id === card.id);
                if (existing) {
                    return prev.map(item =>
                        item.card.id === card.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prev, { card, quantity }];
            });
        }
        handleCloseModal();
    };

    const handleRemoveFromGallery = async (cardId) => {
        // Se autenticado, remove do backend
        if (isAuthenticated) {
            try {
                console.log('🗑️ Removendo carta do backend:', cardId);
                await galleryService.removeCardFromGallery(cardId);
                console.log('✅ Carta removida do backend com sucesso');
                // Após remover do backend, recarrega a galeria
                const updatedGallery = await galleryService.getGallery();
                setMyGalleryItems(updatedGallery.cards || []);
            } catch (error) {
                console.error('❌ Erro ao remover carta do backend:', error);
                // Fallback para localStorage se backend falhar
                setMyGalleryItems(prev => prev.filter(item => item.card.id !== cardId));
            }
        } else {
            // Se não autenticado, remove apenas do localStorage
            setMyGalleryItems(prev => prev.filter(item => item.card.id !== cardId));
        }
    };

    const handleShareGallery = async () => {
        console.log('🔍 Debug - Estado da autenticação:', { 
            isAuthenticated, 
            loading,
            hasToken: !!localStorage.getItem('token'),
            authServiceCheck: authService.isAuthenticated()
        });
        
        // Verificação múltipla de autenticação
        const hasValidAuth = isAuthenticated && authService.isAuthenticated();
        
        if (!hasValidAuth) {
            console.log('❌ Falha na verificação de autenticação:', {
                contextAuth: isAuthenticated,
                serviceAuth: authService.isAuthenticated(),
                token: localStorage.getItem('token')
            });
            alert('Você precisa estar logado para compartilhar sua galeria');
            return;
        }

        console.log('✅ Autenticação válida, prosseguindo com compartilhamento...');

        try {
            const result = await galleryService.shareGallery();
            console.log('✅ Galeria compartilhada com sucesso:', result);
            navigator.clipboard.writeText(result.shareUrl)
                .then(() => alert('Link da galeria copiado para a área de transferência!'))
                .catch(err => {
                    console.error('Erro ao copiar link: ', err);
                    alert(`Link da galeria: ${result.shareUrl}`);
                });
        } catch (error) {
            console.error('❌ Erro ao compartilhar galeria:', error);
            if (error.response?.status === 401) {
                alert('Sessão expirada. Faça login novamente.');
            } else {
                alert('Erro ao gerar link de compartilhamento');
            }
        }
    };
    
    const handleCreateDeck = async (name) => {
        if (isAuthenticated) {
            try {
                const newDeck = await deckService.createDeck(name);
                setMyDecks(prev => [...prev, newDeck]);
            } catch (error) {
                console.error('Erro ao criar deck:', error);
                // Fallback para localStorage
                const newDeck = { id: Date.now().toString(), name, cards: [] };
                setMyDecks(prev => [...prev, newDeck]);
                localStorage.setItem('pokemonDecks', JSON.stringify([...myDecks, newDeck]));
            }
        } else {
            const newDeck = { id: Date.now().toString(), name, cards: [] };
            setMyDecks(prev => [...prev, newDeck]);
            localStorage.setItem('pokemonDecks', JSON.stringify([...myDecks, newDeck]));
        }
    };

    const handleAddCardToDeck = async (deckId, card, quantity = 1) => {
        console.log('🎯 DECK: Tentando adicionar carta ao deck:', { deckId, cardName: card.name, quantity });
        console.log('🎯 DECK: Estado autenticação:', isAuthenticated);
        
        if (isAuthenticated) {
            try {
                console.log('✅ DECK: Usuário autenticado, chamando backend...');
                const updatedDeck = await deckService.addCardToDeck(deckId, card, quantity);
                console.log('✅ DECK: Carta adicionada com sucesso no backend:', updatedDeck);
                setMyDecks(prev => prev.map(deck => 
                    deck.id === deckId || deck._id === deckId ? updatedDeck : deck
                ));
            } catch (error) {
                console.error('❌ DECK: Erro ao adicionar carta ao deck no backend:', error);
                // Fallback para localStorage
                console.log('🔄 DECK: Usando fallback localStorage...');
                handleAddCardToDeckLocal(deckId, card, quantity);
            }
        } else {
            console.log('🔄 DECK: Não autenticado, usando localStorage...');
            handleAddCardToDeckLocal(deckId, card, quantity);
        }
    };

    const handleAddCardToDeckLocal = (deckId, card, quantity = 1) => {
        setMyDecks(prev => {
            // Função para ordenar cartas (mesma lógica do DeckView e backend)
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
            
            const updated = prev.map(deck => {
                if (deck.id !== deckId) return deck;
                
                const existingCardIndex = deck.cards.findIndex(item => item.card.id === card.id);
                let newCards;
                
                if (existingCardIndex >= 0) {
                    newCards = [...deck.cards];
                    newCards[existingCardIndex] = {
                        ...newCards[existingCardIndex],
                        quantity: Math.min(4, newCards[existingCardIndex].quantity + quantity)
                    };
                } else {
                    newCards = [...deck.cards, { card, quantity: Math.min(4, quantity) }];
                }
                
                // Aplicar ordenação automática
                newCards = sortCards(newCards);
                console.log('📋 DECK LOCAL: Cartas reordenadas automaticamente');
                
                return { ...deck, cards: newCards };
            });
            localStorage.setItem('pokemonDecks', JSON.stringify(updated));
            return updated;
        });
    };

    const handleRemoveCardFromDeck = async (deckId, cardId) => {
        if (isAuthenticated) {
            try {
                await deckService.removeCardFromDeck(deckId, cardId);
                setMyDecks(prev => prev.map(deck => {
                    if (deck.id === deckId || deck._id === deckId) {
                        return { ...deck, cards: deck.cards.filter(item => item.card.id !== cardId) };
                    }
                    return deck;
                }));
            } catch (error) {
                console.error('Erro ao remover carta do deck:', error);
                // Fallback para localStorage
                handleRemoveCardFromDeckLocal(deckId, cardId);
            }
        } else {
            handleRemoveCardFromDeckLocal(deckId, cardId);
        }
    };

    const handleRemoveCardFromDeckLocal = (deckId, cardId) => {
        setMyDecks(prev => {
            const updated = prev.map(deck =>
                deck.id === deckId
                    ? { ...deck, cards: deck.cards.filter(item => item.card.id !== cardId) }
                    : deck
            );
            localStorage.setItem('pokemonDecks', JSON.stringify(updated));
            return updated;
        });
    };

    const handleUpdateDeck = async (updatedDeck) => {
        console.log('🔄 DECK: Atualizando deck:', updatedDeck);
        console.log('🔄 DECK: ID do deck:', updatedDeck.id || updatedDeck._id);
        
        if (isAuthenticated) {
            try {
                if (updatedDeck._delete) {
                    console.log('🗑️ DECK: Deletando deck...');
                    await deckService.deleteDeck(updatedDeck.id || updatedDeck._id);
                    setMyDecks(prev => prev.filter(deck => 
                        deck.id !== updatedDeck.id && deck._id !== updatedDeck._id
                    ));
                    console.log('✅ DECK: Deck deletado com sucesso');
                } else {
                    console.log('💾 DECK: Salvando atualização no backend...');
                    const updated = await deckService.updateDeck(updatedDeck.id || updatedDeck._id, updatedDeck);
                    setMyDecks(prev => prev.map(deck =>
                        (deck.id === updatedDeck.id || deck._id === updatedDeck._id) ? updated : deck
                    ));
                    console.log('✅ DECK: Deck atualizado com sucesso');
                }
            } catch (error) {
                console.error('❌ DECK: Erro ao atualizar deck:', error);
                // Fallback para localStorage
                handleUpdateDeckLocal(updatedDeck);
            }
        } else {
            console.log('🔄 DECK: Não autenticado, usando localStorage...');
            handleUpdateDeckLocal(updatedDeck);
        }
    };

    const handleUpdateDeckLocal = (updatedDeck) => {
        setMyDecks(prev => {
            // Função para ordenar cartas (mesma lógica do DeckView e backend)
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
            
            const updated = updatedDeck._delete
                ? prev.filter(deck => (deck.id || deck._id) !== (updatedDeck.id || updatedDeck._id))
                : prev.map(deck => {
                    if ((deck.id === updatedDeck.id || deck._id === updatedDeck._id)) {
                        const newDeck = { ...deck, ...updatedDeck };
                        // Se houver cartas sendo atualizadas, aplicar ordenação
                        if (updatedDeck.cards && Array.isArray(updatedDeck.cards)) {
                            newDeck.cards = sortCards(updatedDeck.cards);
                            console.log('📋 DECK LOCAL UPDATE: Cartas reordenadas automaticamente');
                        }
                        return newDeck;
                    }
                    return deck;
                });
            localStorage.setItem('pokemonDecks', JSON.stringify(updated));
            return updated;
        });
    };

    return (
      <div className={`App${darkMode ? ' dark-mode' : ''}`}>
        <Header />
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar-cartas" element={
              <section id="search-section" className="section">
                <SearchBar onSearch={handleSearch} initialTerm={searchTerm} />
                {isLoading && <div id="loading-message">Carregando...</div>}
                <CardList
                  cards={searchResults}
                  onInspectCard={handleInspectCard}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => handleSearch(searchTerm, page)}
                />
              </section>
            } />
            <Route
              path="/galeria/compartilhada/:token"
              element={
                <SharedGallery
                  onInspectCard={(card) => handleInspectCard(card, false, true)}
                />
              }
            />
            <Route
  path="/minha-galeria"
  element={
    galleryLoaded ? (
      <Gallery
        items={myGalleryItems}
        onInspectCard={handleInspectCard}
        onRemoveCard={handleRemoveFromGallery}
        onShare={handleShareGallery}
        isAuthenticated={isAuthenticated}
      />
    ) : (
      <div>Carregando galeria...</div>
    )
  }
/>
            <Route
                path="/meus-decks"
                element={
                  <Decks
                    decks={myDecks}
                    onCreateDeck={handleCreateDeck}
                  />
                }
              />
              <Route
                path="/meus-decks/:deckId"
                element={
                  <DeckView
                    decks={myDecks}
                    onInspectCard={handleInspectCard}
                    onRemoveCardFromDeck={handleRemoveCardFromDeck}
                    onAddCardToDeck={handleAddCardToDeck}
                    onUpdateDeck={handleUpdateDeck}
                  />
                }
              />
          </Routes>
        </div>
        {isModalOpen && selectedCard && (
          <CardInspectorModal
            card={selectedCard}
            onClose={handleCloseModal}
            onAddToGallery={handleAddToGallery}
            isInGallery={myGalleryItems.some(item =>
              (item.card ? item.card.id : item.id) === selectedCard.id
            )}
            isAddingToGallery={isAddingToGallery}
            isSharedGallery={window.location.pathname.includes("/galeria/compartilhada")}
            decks={myDecks}
            onAddCardToDeck={handleAddCardToDeck}
            isFromDeckView={isFromDeckView}
            inspectedDeckId={inspectedDeckId}
          />
        )}
        {/* Footer só aparece se NÃO estiver em meus-decks/:deckId */}
        {!location.pathname.match(/^\/meus-decks\/[^/]+$/) && (
          <Footer />
        )}
      </div>
    );
}

// Componente principal App com AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;