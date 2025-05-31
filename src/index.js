import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importando os CSS globais e base do projeto original
import './styles/global.css';
import './styles/cards/base.css';
import './styles/cards.css';
import './styles/cards/basic.css';
import './styles/cards/reverse-holo.css';
import './styles/cards/regular-holo.css';
import './styles/cards/cosmos-holo.css';
import './styles/cards/amazing-rare.css';
import './styles/cards/radiant-holo.css';
import './styles/cards/v-regular.css';
import './styles/cards/v-full-art.css';
import './styles/cards/v-max.css';
import './styles/cards/v-star.css';
import './styles/cards/trainer-full-art.css';
import './styles/cards/rainbow-holo.css';
import './styles/cards/rainbow-alt.css';
import './styles/cards/secret-rare.css';
import './styles/cards/trainer-gallery-holo.css';
import './styles/cards/trainer-gallery-v-regular.css';
import './styles/cards/trainer-gallery-v-max.css';
import './styles/cards/trainer-gallery-secret-rare.css';
import './styles/cards/shiny-rare.css';
import './styles/cards/shiny-v.css';
import './styles/cards/shiny-vmax.css';
import './styles/cards/swsh-pikachu.css'; //

// Seus estilos customizados para o App (se houver)
import './App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);