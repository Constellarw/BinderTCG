import React from 'react';

function CardPreview({ card, onInspect, style, hideName }) {
    return (
        <div onClick={onInspect} style={style}>
            <img src={card.images?.small || 'placeholder.png'} alt="" style={{ width: '100%', borderRadius: 6 }} />
            {!hideName && (
                <div style={{ textAlign: 'center', marginTop: 4, fontSize: 13, color: '#fff' }}>
                    {card.name}
                </div>
            )}
        </div>
    );
}

export default CardPreview;