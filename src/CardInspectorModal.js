import React, { useState } from 'react';
import InspectedCard from './InspectedCard';

function CardInspectorModal({ card, onClose, onAddToGallery, isInGallery, isAddingToGallery, isSharedGallery, decks, onAddCardToDeck, isFromDeckView, inspectedDeckId }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedDeckId, setSelectedDeckId] = useState('');

    if (!card) return null;

    const isOnMyGalleryPage = window.location.pathname === "/minha-galeria";
    const canAddToGallery = !isSharedGallery && !isOnMyGalleryPage && !isFromDeckView;

    return (
        <div id="card-inspector-modal" className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close-button" id="close-modal-button" onClick={onClose}>&times;</span>
                <div id="inspected-card-container">
                    <InspectedCard cardData={card} />
                </div>
                {canAddToGallery && (
                    <>
                        {isAddingToGallery && (
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                style={{ width: 60, marginRight: 8, position: 'relative', top: '50px', height: 30, right: '116px' }}
                            />
                        )}
                        <button id="add-to-gallery-button" onClick={() => onAddToGallery(card, quantity)}>
                            Salvar na Galeria
                        </button>
                        <div style={{ marginTop: 16 }}>
                            <select
                                value={selectedDeckId}
                                onChange={e => setSelectedDeckId(e.target.value)}
                                style={{ marginRight: 8 }}
                            >
                                <option value="">Selecione um deck</option>
                                {decks.map(deck => (
                                    <option key={deck.id} value={deck.id}>{deck.name} ({deck.cards.length}/60)</option>
                                ))}
                            </select>
                            <button
                                disabled={!selectedDeckId}
                                onClick={() => {
                                    onAddCardToDeck(selectedDeckId, card, quantity);
                                    setSelectedDeckId('');
                                    setQuantity(1);
                                    onClose();
                                }}
                            >
                                Salvar em Deck
                            </button>
                        </div>
                    </>
                )}
                {isFromDeckView && inspectedDeckId && (
                  <div style={{ marginTop: 24 }}>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      style={{ width: 60, marginRight: 8 }}
                    />
                    <button
                      onClick={() => {
                        onAddCardToDeck(inspectedDeckId, card, quantity);
                        setQuantity(1);
                        onClose();
                      }}
                    >
                      Adicionar ao Deck
                    </button>
                  </div>
                )}
            </div>
        </div>
    );
}

export default CardInspectorModal;