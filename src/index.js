import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar estilos globais
import './styles/global.css';
import './App.css';

// Importar estilos base das cartas
import './styles/cards.css';

// Importar todos os efeitos CSS de cartas especiais
import './styles/cards/base.css';
import './styles/cards/basic.css';
import './styles/cards/amazing-rare.css';
import './styles/cards/cosmos-holo.css';
import './styles/cards/ex-fa.css';
import './styles/cards/ex-regular.css';
import './styles/cards/ex-special.css';
import './styles/cards/radiant-holo.css';
import './styles/cards/rainbow-alt.css';
import './styles/cards/rainbow-holo.css';
import './styles/cards/regular-holo.css';
import './styles/cards/reverse-holo.css';
import './styles/cards/secret-rare.css';
import './styles/cards/shiny-rare.css';
import './styles/cards/shiny-v.css';
import './styles/cards/shiny-vmax.css';
import './styles/cards/swsh-pikachu.css';
import './styles/cards/trainer-full-art.css';
import './styles/cards/trainer-gallery-holo.css';
import './styles/cards/trainer-gallery-secret-rare.css';
import './styles/cards/trainer-gallery-v-max.css';
import './styles/cards/trainer-gallery-v-regular.css';
import './styles/cards/v-full-art.css';
import './styles/cards/v-max.css';
import './styles/cards/v-regular.css';
import './styles/cards/v-star.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);