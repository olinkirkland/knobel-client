import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../../controllers/connection';
import { text } from '../../controllers/locale';
import Terminal from '../../controllers/terminal';
import Game from '../../data/game';
import { me } from '../../data/user';

export default function GamePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    try {
      const res = await axios.get(SERVER_URL + 'game/list');
      setGames(res.data);
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  async function join(id: string) {
    Terminal.log('Joining game', id, '...');
    try {
      const res = await axios.post(SERVER_URL + 'game/join', { id: id });
      Terminal.log('Joined game', id, 'successfully');
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  async function host() {
    Terminal.log('Hosting a game...');
    try {
      const options = {
        name: `${me.name}'s game`
      };
      const res = await axios.post(SERVER_URL + 'game/host', options);
      console.log(res);
      const gameId = res.data;
      Terminal.log('Game created', gameId);
      join(gameId);
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
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
