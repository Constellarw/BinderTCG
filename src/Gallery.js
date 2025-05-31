import React from 'react';
import CardPreview from './CardPreview';

function Gallery({ items, onInspectCard, onRemoveCard, onShare }) {
    return (
        <section id="my-gallery-section" className="section">
            <h2>Minha Galeria de Cartas</h2>
            {items.length === 0 ? (
                <p id="empty-gallery-message">Sua galeria está vazia. Adicione cartas da busca!</p>
            ) : (
                <div id="gallery-grid" className="card-grid">
                    {items.map(card => (
                        <div key={card.id} style={{ position: 'relative' }}>
                            <CardPreview card={card} onInspect={() => onInspectCard(card)} />
                            <button 
                                onClick={() => onRemoveCard(card.id)}
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
                        </div>
                    ))}
                </div>
            )}
            {items.length > 0 && (
                <div id="gallery-actions" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button id="share-gallery-button" onClick={onShare}>Compartilhar Galeria</button>
                </div>
            )}
        </section>
    );
}
export default Gallery;