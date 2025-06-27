import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { galleryService } from './services/api';
import CardList from './CardList';

function SharedGallery({ onInspectCard }) {
  const { token } = useParams();
  const [sharedGallery, setSharedGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedGallery = async () => {
      if (!token) {
        setError('Token de compartilhamento não encontrado');
        setLoading(false);
        return;
      }

      try {
        const data = await galleryService.getSharedGallery(token);
        setSharedGallery(data);
      } catch (err) {
        console.error('Erro ao carregar galeria compartilhada:', err);
        setError('Galeria compartilhada não encontrada ou não está mais disponível');
      } finally {
        setLoading(false);
      }
    };

    loadSharedGallery();
  }, [token]);

  if (loading) {
    return (
      <section className="section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Carregando galeria compartilhada...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Erro</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!sharedGallery) {
    return (
      <section className="section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Galeria não encontrada</h2>
          <p>Esta galeria pode ter sido removida ou não está mais disponível.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h1>Galeria Compartilhada</h1>
        
        {sharedGallery.sharedBy && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #ddd'
          }}>
            {sharedGallery.sharedBy.picture && (
              <img 
                src={sharedGallery.sharedBy.picture} 
                alt={sharedGallery.sharedBy.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                Compartilhado por: {sharedGallery.sharedBy.name}
              </p>
              {sharedGallery.sharedAt && (
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  Compartilhado em: {new Date(sharedGallery.sharedAt).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {sharedGallery.cards && sharedGallery.cards.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          Esta galeria está vazia.
        </p>
      ) : (
        <div>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {sharedGallery.cards ? sharedGallery.cards.length : 0} carta(s) na galeria
          </p>
          <CardList 
            cards={sharedGallery.cards ? sharedGallery.cards.map(item => item.card || item) : []} 
            onInspectCard={onInspectCard} 
          />
        </div>
      )}
    </section>
  );
}

export default SharedGallery;
