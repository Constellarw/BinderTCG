import React from 'react';
import CardPreview from './CardPreview';

function CardList({ cards, onInspectCard, currentPage, totalPages, onPageChange }) {
    if (!cards || cards.length === 0) {
        return <p style={{textAlign: 'center', marginTop: '20px'}}>Nenhuma carta encontrada ou busca não realizada.</p>;
    }

    return (
        <>
            <div id="card-list" className="card-grid">
                {cards.map(card => (
                    <CardPreview key={card.id} card={card} onInspect={() => onInspectCard(card, true)} />
                ))}
            </div>
            <div id="pagination-controls" style={{ textAlign: 'center', marginTop: '20px' }}>
                {currentPage > 1 && (
                    <button onClick={() => onPageChange(currentPage - 1)}>Anterior</button>
                )}
                {totalPages > 0 && <span> Página {currentPage} de {totalPages} </span>}
                {currentPage < totalPages && (
                    <button onClick={() => onPageChange(currentPage + 1)}>Próxima</button>
                )}
            </div>
        </>
    );
}
export default CardList;    