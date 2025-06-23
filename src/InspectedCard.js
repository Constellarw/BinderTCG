import React, { useState, useRef, useEffect } from 'react';

// Função auxiliar para gerar classes baseadas nos dados da carta
// Você precisará expandir isso MUITO para cobrir todas as variações do CSS original
const getCardClasses = (card) => {
    let classes = ['card']; // Classe base

    // Tipo (ex: type-grass, type-fire)
    if (card.types && card.types.length > 0) {
        classes.push(`type-${card.types[0].toLowerCase()}`);
    }

    // Raridade (ex: rarity-rare-holo, rarity-amazing-rare)
    // As classes no CSS original podem ter formatos como 'rarity-holo', 'amazing-rare' etc.
    // É preciso mapear a string da API para a classe CSS correta.
    if (card.rarity) {
        const rarityClass = card.rarity.toLowerCase().replace(/\s+/g, '-'); // "Rare Holo" -> "rare-holo"
        classes.push(`rarity-${rarityClass}`); // Adiciona prefixo 'rarity-' para consistência, se necessário

        // Classes específicas de raridade/efeito do projeto original
        // Isso é uma suposição e precisa ser verificado contra os CSS originais
        if (card.rarity.includes("Holo")) classes.push('holo'); // Pode ser 'regular-holo'
        if (card.rarity.includes("Reverse Holo")) classes.push('reverse-holo');
        if (card.rarity === "Amazing Rare") classes.push('amazing-rare');
        if (card.rarity === "Radiant Rare") classes.push('radiant-holo');
        // Adicionar mais mapeamentos conforme necessário (V, VMAX, VSTAR, Rainbow, etc.)
    }
    
    // Subtipos (V, VMAX, VSTAR, etc)
    if (card.subtypes) {
        card.subtypes.forEach(subtype => {
            const sub = subtype.toLowerCase().replace(/\s+/g, '-');
            if (['v', 'vmax', 'vstar', 'basic', 'stage-1', 'stage-2', 'trainer'].includes(sub)) {
                 // Classes como v-max, v-star, v-regular, trainer-full-art etc.
                if (sub === 'v' && card.rarity && card.rarity.toLowerCase().includes('full art')) {
                    classes.push('v-full-art');
                } else if (sub === 'v') {
                    classes.push('v-regular'); // ou apenas 'v' dependendo do CSS
                } else {
                    classes.push(sub);
                }
            }
        });
    }


    // Energia (para estilizar fundos, bordas, etc. ex: energy-grass)
    // O projeto original pode usar a classe de tipo para isso.
    // Se houver classes específicas de energia, adicione-as.

    // Este é um ponto crucial: você deve inspecionar os arquivos CSS
    // do projeto `pokemon-cards-css` para entender quais classes
    // são esperadas para cada efeito e tipo de carta.
    // Por exemplo, `css/cards/v-max.css` terá classes específicas.

    // Adicione classes como 'loaded' ou 'active' se o CSS as usar para iniciar animações
    classes.push('active'); // Exemplo
    classes.push('loaded'); // Exemplo

    return classes.join(' ');
};

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function InspectedCard({ cardData }) {
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const cardRef = useRef(null);
  const touchMoveFrame = useRef(null);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const cardClasses =
    getCardClasses(cardData) +
    (loading ? ' loading' : '') +
    (interacting ? ' interacting' : '');

  const imageUrl =
    cardData.images && cardData.images.large
      ? cardData.images.large
      : 'placeholder_large.png';

  // Flip automático ao carregar a imagem
  const handleImageLoad = () => {
    setLoading(false);
    setTimeout(() => setFlipped(false), 150);
  };

  // Flip manual ao clicar
  const handleCardClick = () => {
    setFlipped((f) => !f);
  };

  const getFlipRotate = () => (flipped ? '180deg' : '0deg');

  // Interação do mouse (desktop)
  const handlePointerMove = (e) => {
    if (isMobileDevice) return; // Não faz tilt no mobile
    setInteracting(true);
    const card = cardRef.current;
    if (!card) return;
    if (flipped) {
      // Se estiver flipada para trás, não inclina
      card.style.setProperty('--rotate-x', `0deg`);
      card.style.setProperty('--rotate-y', `0deg`);
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const centerX = x - 50;
    const centerY = y - 50;
    const pointerFromCenter = Math.sqrt(centerX * centerX + centerY * centerY) / 50;
    const pointerFromTop = y / 100;
    const pointerFromLeft = x / 100;

    // Mais sensível:
    const rotateX = -centerY;
    const rotateY = centerX;

    card.style.setProperty('--pointer-x', `${x}%`);
    card.style.setProperty('--pointer-y', `${y}%`);
    card.style.setProperty('--pointer-from-center', pointerFromCenter);
    card.style.setProperty('--pointer-from-top', pointerFromTop);
    card.style.setProperty('--pointer-from-left', pointerFromLeft);
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
    card.style.setProperty('--background-x', `${x}%`);
    card.style.setProperty('--background-y', `${y}%`);
    card.style.setProperty('--card-scale', 1.12);
    card.style.setProperty('--card-opacity', 1);
  };

  // Interação de toque (mobile)
  const handleTouchMove = (e) => {
    if (!isMobileDevice) return;
    setInteracting(true);
    const card = cardRef.current;
    if (!card) return;
    if (flipped) {
      card.style.setProperty('--rotate-x', `0deg`);
      card.style.setProperty('--rotate-y', `0deg`);
      return;
    }
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    const centerX = x - 50;
    const centerY = y - 50;
    const rotateX = -centerY * 0.5;
    const rotateY = centerX * 0.5;

    // Use requestAnimationFrame para suavizar
    if (touchMoveFrame.current) cancelAnimationFrame(touchMoveFrame.current);
    touchMoveFrame.current = requestAnimationFrame(() => {
      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
      card.style.setProperty('--card-scale', 1.08);
      card.style.setProperty('--card-opacity', 1);
    });
  };

  useEffect(() => {
    return () => {
      if (touchMoveFrame.current) cancelAnimationFrame(touchMoveFrame.current);
    };
  }, []);

  const handlePointerOut = () => {
    setInteracting(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--pointer-x', `50%`);
    card.style.setProperty('--pointer-y', `50%`);
    card.style.setProperty('--pointer-from-center', 0);
    card.style.setProperty('--pointer-from-top', 0.5);
    card.style.setProperty('--pointer-from-left', 0.5);
    card.style.setProperty('--rotate-x', `0deg`);
    card.style.setProperty('--rotate-y', `0deg`);
    card.style.setProperty('--background-x', `50%`);
    card.style.setProperty('--background-y', `50%`);
    card.style.setProperty('--card-scale', 1);
    card.style.setProperty('--card-opacity', 0);
  };

  return (
    <article className={cardClasses} onClick={handleCardClick}>
      <div className="card__translater">
        <div
          className="card__rotator"
          ref={cardRef}
          style={{
            '--flip-rotate': getFlipRotate(),
          }}
          onPointerMove={handlePointerMove}
          onPointerOut={handlePointerOut}
          onTouchMove={handleTouchMove}
          onTouchEnd={handlePointerOut}
        >
          <div className="card__front">
            <img
              src={imageUrl}
              alt={cardData.name}
              className="card__image"
              onLoad={handleImageLoad}
              draggable={false}
            />
          </div>
          <div className="card__shine"></div>
          <div className="card__glare"></div>
          <div className="card__back">
            <img
              src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
              alt="Verso da carta"
              className="card__image"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default InspectedCard;