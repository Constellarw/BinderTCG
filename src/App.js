import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import CardList from './CardList';
import Gallery from './Gallery';
import CardInspectorModal from './CardInspectorModal';
import Footer from './Footer';
import './App.css'; // Para estilos do layout principal do App

const POKEMON_API_KEY = "ded63161-025b-4626-b221-a5bb93fa72ed";
const API_BASE_URL = "https://api.pokemontcg.io/v2/cards";

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState('search'); // 'search' or 'gallery'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Carregar galeria do localStorage ao iniciar
    useEffect(() => {
        const storedGallery = localStorage.getItem('pokemonGallery');
        if (storedGallery) {
            setGalleryItems(JSON.parse(storedGallery));
        }
    }, []);

    // Salvar galeria no localStorage quando mudar
    useEffect(() => {
        localStorage.setItem('pokemonGallery', JSON.stringify(galleryItems));
    }, [galleryItems]);

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

    const handleInspectCard = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCard(null);
    };

    const handleAddToGallery = (card) => {
        if (!galleryItems.find(item => item.id === card.id)) {
            setGalleryItems([...galleryItems, card]);
        }
        handleCloseModal();
    };

    const handleRemoveFromGallery = (cardId) => {
        setGalleryItems(galleryItems.filter(item => item.id !== cardId));
    };

    const handleShareGallery = () => {
        const cardIds = galleryItems.map(card => card.id).join(',');
        const shareUrl = `${window.location.origin}${window.location.pathname}?gallery=${cardIds}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Link da galeria copiado para a área de transferência!'))
            .catch(err => console.error('Erro ao copiar link: ', err));
    };
    
    // Efeito para carregar galeria da URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const galleryQuery = urlParams.get('gallery');
        if (galleryQuery) {
            const ids = galleryQuery.split(',');
            const fetchGalleryCards = async () => {
                setIsLoading(true);
                try {
                    // A API do Pokemon TCG não suporta buscar múltiplos IDs de uma vez de forma simples com 'OR' na query de ID.
                    // Uma alternativa é buscar por nome/set ou fazer chamadas individuais (menos eficiente)
                    // Para simplificar, vamos instruir o usuário ou apenas mostrar a primeira carta.
                    // Ou, se tivermos todos os dados já no searchResults ou em um "cache", podemos usar isso.
                    // A forma mais robusta seria buscar cada ID individualmente se não estiverem em cache.
                    // Por ora, vamos apenas mostrar um alerta e mudar para a visualização da galeria.
                    console.log("IDs para carregar na galeria a partir da URL:", ids);
                    alert("Funcionalidade de carregar galeria por URL: implemente a busca por IDs.");
                    // Exemplo de busca por um ID (precisaria de um loop e Promise.all para vários)
                    // const response = await fetch(`${API_BASE_URL}/${ids[0]}`, { headers: { 'X-Api-Key': POKEMON_API_KEY }});
                    // const data = await response.json();
                    // setGalleryItems([data.data]); // Exemplo com uma carta
                    setActiveView('gallery');
                } catch (error) {
                    console.error("Erro ao carregar galeria da URL:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchGalleryCards();
             // Limpar a query da URL para não recarregar sempre
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);


    return (
        <div className="App">
            <Header />
            <Navigation setActiveView={setActiveView} />
            
            <div className="container"> {/* Adicione estilos para .container em App.css */}
                {activeView === 'search' && (
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
                )}

                {activeView === 'gallery' && (
                    <Gallery
                        items={galleryItems}
                        onInspectCard={handleInspectCard}
                        onRemoveCard={handleRemoveFromGallery}
                        onShare={handleShareGallery}
                    />
                )}
            </div>

            {isModalOpen && selectedCard && (
                <CardInspectorModal
                    card={selectedCard}
                    onClose={handleCloseModal}
                    onAddToGallery={handleAddToGallery}
                    isInGallery={galleryItems.some(item => item.id === selectedCard.id)}
                />
            )}
            <Footer />
        </div>
    );
}

export default App;