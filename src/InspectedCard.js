import React, { useState } from 'react';

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

function InspectedCard({ cardData }) {
  const [flipped, setFlipped] = useState(false);
  const cardClasses = getCardClasses(cardData);
  const imageUrl = cardData.images && cardData.images.large ? cardData.images.large : 'placeholder_large.png';

  return (
    <article
      className={cardClasses}
      data-name={cardData.name}
      id={cardData.id}
      data-rarity={cardData.rarity ? cardData.rarity.toLowerCase() : undefined}
      onClick={() => setFlipped(f => !f)} // flip ao clicar
    >
      <div className="card__translater">
        <div className="card__rotator" style={{ transform: flipped ? 'rotateY(180deg)' : undefined }}>
          <div className="card__front">
            <img src={imageUrl} alt={cardData.name} className="card__image" />
          </div>
          <div className="card__shine"></div>
          <div className="card__glare"></div>
          <div className="card__back">
            <img src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg" alt="Verso da carta" className="card__image" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default InspectedCard;