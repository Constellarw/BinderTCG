import React, { useState } from 'react';
import InspectedCard from './InspectedCard'; 

function CardInspectorModal({ card, onClose, onAddToGallery, isInGallery, isAddingToGallery, isSharedGallery }) {
    const [quantity, setQuantity] = useState(1);

    if (!card) return null;

    // Só mostra o botão se NÃO estiver na galeria (isSharedGallery === false E window.location.pathname !== "/minha-galeria")
    const isOnMyGalleryPage = window.location.pathname === "/minha-galeria";
    const canAddToGallery = !isSharedGallery && !isOnMyGalleryPage;

    return (
        <div id="card-inspector-modal" className="modal" style={{ display: 'flex' }}> 
            <div className="modal-content">
                <span className="close-button" id="close-modal-button" onClick={onClose}>&times;</span>
                <div id="inspected-card-container">
                    <InspectedCard cardData={card} />
                </div>
                {canAddToGallery && (
                    <>
                        {/* Seletor de quantidade */}
                        {isAddingToGallery && (
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={e => setQuantity(Number(e.target.value))}
                                style={{ width: 60, marginRight: 8, position: 'relative', top:'50px',height: 30, right: '116px' }}
                            />
                        )}
                        <button id="add-to-gallery-button" onClick={() => onAddToGallery(card, quantity)}>
                            Salvar na Galeria
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default CardInspectorModal;