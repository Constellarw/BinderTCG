import React from 'react';

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
    const cardClasses = getCardClasses(cardData);
    const imageUrl = cardData.images && cardData.images.large ? cardData.images.large : 'placeholder_large.png';

    // A estrutura interna do card__rotator precisa ser preenchida
    // com os elementos visuais da carta (nome, ataques, HP, etc.)
    // que você pegaria dos dados de `cardData`.
    // O projeto original CSS pode ter placeholders para esses elementos
    // ou estilizar diretamente a imagem de fundo.

    return (
        // A classe 'pokemon-card' é um exemplo, use a classe principal do CSS original
        // A estrutura card > card__translater > card__rotator é do projeto original
        <article className={cardClasses} data-name={cardData.name} id={cardData.id}>
            <div className="card__translater">
                <div className="card__rotator">
                    {/* Camada da Imagem Principal */}
                    <div className="card__front">
                        <img src={imageUrl} alt={cardData.name} className="card__image" />
                        {/* Outros elementos do card como nome, HP, ataques podem ser sobrepostos aqui se necessário */}
                        {/* Exemplo: <p className="card__name">{cardData.name}</p> */}
                    </div>

                    {/* Camadas de Efeito Holográfico - Adicione conforme o CSS original */}
                    {/* Essas camadas são geralmente divs vazias que o CSS usa para criar os brilhos e padrões */}
                    {/* Verifique os arquivos .css (ex: regular-holo.css, cosmos-holo.css) para ver quais camadas são necessárias */}
                    {/* Exemplo para um holo genérico, pode variar: */}
                    {cardClasses.includes('holo') && !cardClasses.includes('reverse-holo') && (
                        <>
                            <div className="card__holo_layer--1"></div>
                            <div className="card__holo_layer--2"></div>
                            {/* Adicione mais se necessário */}
                        </>
                    )}
                    {/* Para reverse holo, as camadas e seletores podem ser diferentes */}
                     {cardClasses.includes('reverse-holo') && (
                        <>
                            {/* Camadas específicas para reverse-holo */}
                        </>
                    )}
                    {/* Adicione condicionais para outras camadas de efeitos (Cosmos, Amazing Rare, etc.) */}

                </div>
            </div>
        </article>
    );
}

export default InspectedCard;