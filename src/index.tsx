import React from 'react';
import ReactDOM from 'react-dom';
import { PopupProvider } from 'react-popup-manager';
import App from './App';
import './assets/css/general.css';
import './assets/css/popups.css';
import './assets/css/queries.css';
import './assets/css/styles.css';
import './assets/css/game.css';
import './assets/css/shop.css';

export const rootElement = document.getElementById('root');

function Main() {
  return (
    <React.StrictMode>
      <PopupProvider>
        <App />
      </PopupProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(Main(), rootElement);
