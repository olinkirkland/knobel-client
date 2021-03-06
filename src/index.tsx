import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Styles
import './assets/css/alert.css';
import './assets/css/buttons.css';
import './assets/css/checkbox.css';
import './assets/css/general.css';
import './assets/css/home-page.css';
import './assets/css/game-page.css';
import './assets/css/input.css';
import './assets/css/platform.css';
import './assets/css/popups.css';
import './assets/css/popups-queries.css';
import './assets/css/progress-bar.css';
import './assets/css/shop.css';
import './assets/css/terminal.css';
import './assets/css/collection.css';
import './assets/css/chat.css';

// Media Queries
import './assets/css/platform-queries.css';
import './assets/css/home-page-queries.css';
import './assets/css/popups-queries.css';
import './assets/css/shop-queries.css';

const rootElement = document.getElementById('root');

function Main() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

ReactDOM.render(Main(), rootElement);
