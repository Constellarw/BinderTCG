import React from 'react';

function CardPreview({ card, onInspect }) {
    const imageUrl = card.images && card.images.small ? card.images.small : 'placeholder.png';
    const cardName = card.name || 'Nome Indisponível';

    return (
        <div className="card-preview" onClick={onInspect} title={`Inspecionar ${cardName}`}>
            <img src={imageUrl} alt={cardName} />
            <p>{cardName}</p>
        </div>
    );
}
export default CardPreview;