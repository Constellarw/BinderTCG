import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import CardList from './CardList';
import Gallery from './Gallery';
import CardInspectorModal from './CardInspectorModal';
import Footer from './Footer';
import './App.css';

const POKEMON_API_KEY = "ded63161-025b-4626-b221-a5bb93fa72ed";
const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";

// Novo componente Home
function Home() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <h1>Bem-vindo à sua Coleção Pokémon!</h1>
      <p>Gerencie, busque e compartilhe suas cartas Pokémon favoritas.</p>
    </section>
  );
}

function PastaCompartilhada({ items, onInspectCard }) {
  return (
    <section className="section">
      <h1>Pasta compartilhada</h1>
      {items.length === 0 ? (
        <p>Nenhuma carta compartilhada.</p>
      ) : (
        <CardList cards={items.map(i => i.card || i)} onInspectCard={onInspectCard} />
      )}
    </section>
  );
}

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState('search'); 
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const [isAddingToGallery, setIsAddingToGallery] = useState(false);
    const [myGalleryItems, setMyGalleryItems] = useState(() => {
        const saved = localStorage.getItem('pokemonGallery');
        return saved ? JSON.parse(saved) : [];
    });
    const [sharedGalleryItems, setSharedGalleryItems] = useState([]);
    const [galleryLoaded, setGalleryLoaded] = useState(false);

    useEffect(() => {
        const storedGallery = localStorage.getItem('pokemonGallery');
        if (storedGallery) {
            setMyGalleryItems(JSON.parse(storedGallery));
        }
        setGalleryLoaded(true);
    }, []);

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

    const handleInspectCard = (card, adding = false, shared = false) => {
      setSelectedCard(card);
      setIsModalOpen(true);
      setIsAddingToGallery(adding);
      if (shared) setActiveView('gallery');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleAddToGallery = (card, quantity = 1) => {
        setMyGalleryItems(prev => {
            const existing = prev.find(item => item.card.id === card.id);
            if (existing) {
                // Atualiza a quantidade
                return prev.map(item =>
                    item.card.id === card.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Adiciona nova carta
            return [...prev, { card, quantity }];
        });
        handleCloseModal();
    };

    const handleRemoveFromGallery = (cardId) => {
        setMyGalleryItems(prev => prev.filter(item => item.card.id !== cardId));
    };

    const handleShareGallery = () => {
        const cardIds = myGalleryItems.map(item => item.card.id).join(',');
        const encoded = btoa(cardIds); // base64
        const shareUrl = `${window.location.origin}/galeria/compartilhada?g=${encoded}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Link da galeria copiado para a área de transferência!'))
            .catch(err => console.error('Erro ao copiar link: ', err));
    };
    
    // Efeito para carregar galeria da URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        // Aceita tanto 'g' (novo) quanto 'gallery' (antigo)
        const galleryQuery = urlParams.get('g') || urlParams.get('gallery');
        if (window.location.pathname === "/galeria/compartilhada" && galleryQuery) {
            let ids;
            try {
                // Se for base64, decodifica
                ids = atob(galleryQuery).split(',');
            } catch {
                // Se não for base64, assume CSV puro
                ids = galleryQuery.split(',');
            }
            const fetchGalleryCards = async () => {
                setIsLoading(true);
                try {
                    const cards = await Promise.all(
                        ids.map(async (id) => {
                            const response = await fetch(`${API_BASE_URL}/${id}`, {
                                headers: { 'X-Api-Key': POKEMON_API_KEY }
                            });
                            if (!response.ok) return null;
                            const data = await response.json();
                            return data.data || null;
                        })
                    );
                    setSharedGalleryItems(cards.filter(Boolean));
                    setActiveView('gallery');
                } catch (error) {
                    console.error("Erro ao carregar galeria da URL:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGalleryCards();
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);


    return (
      <Router>
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
  path="/galeria/compartilhada"
  element={
    <PastaCompartilhada
      items={sharedGalleryItems}
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
      />
    ) : (
      <div>Carregando galeria...</div>
    )
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
              isSharedGallery={activeView === 'gallery' && window.location.pathname === "/galeria/compartilhada"}
            />
          )}
          {/* Footer só aparece se NÃO estiver na busca com pesquisa feita e NÃO na pasta compartilhada */}
          {!(
            (window.location.pathname === "/buscar-cartas" && searchTerm && searchResults.length > 0) ||
            window.location.pathname === "/galeria/compartilhada" || window.location.pathname === "/minha-galeria"
          ) && <Footer />}
        </div>
      </Router>
    );
}

export default App;