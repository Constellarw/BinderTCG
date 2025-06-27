import React, { useState } from 'react';
import CardPreview from './CardPreview';
import { galleryService } from './services/api';

function Gallery({ items, onInspectCard, onRemoveCard, onShare, isAuthenticated }) {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = async () => {
        console.log('🎴 Gallery: Tentando compartilhar galeria...', { isAuthenticated });
        
        if (!isAuthenticated) {
            console.log('❌ Gallery: Falha na autenticação');
            alert('Você precisa estar logado para compartilhar sua galeria.');
            return;
        }

        console.log('✅ Gallery: Autenticação OK, prosseguindo...');
        setIsSharing(true);
        try {
            const result = await galleryService.shareGallery();
            console.log('✅ Gallery: Compartilhamento bem-sucedido:', result);
            const shareUrl = result.shareUrl;
            
            await navigator.clipboard.writeText(shareUrl);
            alert('Link da galeria copiado para a área de transferência!\n\nQualquer pessoa com este link poderá ver sua galeria.');
        } catch (error) {
            console.error('❌ Gallery: Erro ao compartilhar galeria:', error);
            // Fallback para método antigo se o backend falhar
            if (onShare) {
                console.log('🔄 Gallery: Usando fallback onShare...');
                onShare();
            } else {
                alert('Erro ao compartilhar galeria. Tente novamente.');
            }
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <section id="my-gallery-section" className="section">
            <h2>Minha Galeria de Cartas</h2>
            {items.length === 0 ? (
                <p id="empty-gallery-message">Sua galeria está vazia. Adicione cartas da busca!</p>
            ) : (
                <div id="gallery-grid" className="card-grid">
                    {items.map(item => (
                        <div key={item.card ? item.card.id : item.id} style={{ position: 'relative' }}>
                            <CardPreview 
                                card={item.card || item} 
                                onInspect={() => onInspectCard(item.card || item, false)} 
                            />
                            <button 
                                onClick={() => onRemoveCard(item.card ? item.card.id : item.id)}
                                style={{
                                    position: 'absolute', top: '5px', right: '5px',
                                    background: '#e3350d', color: 'white', border: 'none',
                                    borderRadius: '50%', width: '25px', height: '25px',
                                    cursor: 'pointer', fontSize: '14px', lineHeight: '25px',
                                    textAlign: 'center'
                                }}
                                title="Remover da Galeria"
                            >
                                X
                            </button>
                            <span>{item.card ? item.card.name : item.name} {item.quantity ? `(x${item.quantity})` : ''}</span>
                        </div>
                    ))}
                </div>
            )}
            {items.length > 0 && (
                <div id="gallery-actions" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        id="share-gallery-button" 
                        onClick={handleShare}
                        disabled={isSharing}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isSharing ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isSharing ? 'not-allowed' : 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {isSharing ? 'Compartilhando...' : 'Compartilhar Galeria'}
                    </button>
                    {!isAuthenticated && (
                        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                            Para compartilhar com informações do usuário, faça login.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}
export default Gallery;