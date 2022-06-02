import axios from 'axios';
import { useState } from 'react';
import { SERVER_URL } from '../../controllers/connection';
import { text } from '../../controllers/locale';
import Terminal from '../../controllers/terminal';
import Game from '../../data/game';
import { me } from '../../data/user';

export default function GamePage() {
  const [games, setGames] = useState<Game[]>([]);

  function fetchGames() {
    axios.get(SERVER_URL + 'game/list').then((response) => {
      setGames(response.data);
    });
  }

  function host() {
    axios
      .post(SERVER_URL + 'game/host', { name: `${me.name}'s game` })
      .then((res) => {})
      .catch((err) => {
        Terminal.log('⚠️', err);
      });
  }

  return (
    <div className="page game-page">
      <div className="game-container">
        <div className="v-group center">
          <button className="btn">{text('playNow')}</button>
          <button className="btn-link" onClick={host}>
            {text('createGame')}
          </button>
        </div>
        <div className="game-list">
          <div className="h-group center game-list-header">
            <p>{text('availableGames')}</p>
            <button className="btn" onClick={fetchGames}>
              <i className="fas fa-sync"></i>
            </button>
          </div>
          <ul>
            {games.map((game) => (
              <li key={game.id}>
                <p>{game.name}</p>
                <button className="btn">{text('join')}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
