import React from 'react';
import InspectedCard from './InspectedCard'; // Este componente cuidará da renderização com classes de efeito

function CardInspectorModal({ card, onClose, onAddToGallery, isInGallery }) {
    if (!card) return null;

    return (
        <div id="card-inspector-modal" className="modal" style={{ display: 'flex' }}> {/* Alterado para flex para alinhar */}
            <div className="modal-content">
                <span className="close-button" id="close-modal-button" onClick={onClose}>&times;</span>
                <div id="inspected-card-container">
                    <InspectedCard cardData={card} />
                </div>
                {!isInGallery && (
                    <button id="add-to-gallery-button" onClick={() => onAddToGallery(card)}>
                        Salvar na Galeria
                    </button>
                )}
                 {isInGallery && (
                    <p style={{textAlign: 'center', marginTop: '15px', color: '#4CAF50'}}>Esta carta já está na sua galeria!</p>
                )}
            </div>
        </div>
    );
}
export default CardInspectorModal;