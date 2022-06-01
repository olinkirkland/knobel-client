import { text } from '../../controllers/locale';

export default function GamePage() {
  return (
    <div className="page game-page">
      <div className="game-container">
        <div className="v-group center">
          <button className="btn">{text('playNow')}</button>
          <button className="btn-link">{text('createGame')}</button>
        </div>
        <div className="game-list">
          <div className="h-group center game-list-header">
            <p>{text('availableGames')}</p>
            <button className="btn">
              <i className="fas fa-sync"></i>
            </button>
          </div>
          <ul></ul>
        </div>
      </div>
    </div>
  );
}
