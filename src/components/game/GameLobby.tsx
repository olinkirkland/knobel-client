import Connection from '../../connection/Connection';
import Game from '../../connection/Game';
import PopupMediator from '../../controllers/PopupMediator';
import { getItemById } from '../../models/Item';
import { PopupProfile } from '../popups/PopupProfile';

interface Props {
  game: Game;
}

export default function GameLobby({ game }: Props) {
  return (
    <div className="game-lobby v-group">
      <h2>Scoreboard</h2>
      {/* <pre>
        {game.players.map(
          (p: any) => p.user.username + ': ' + JSON.stringify(p.rewards) + '\n'
        )}
      </pre> */}
      <ul>
        {game.players.map((p: any, index: number) => (
          // User badge
          <li
            key={index}
            className={`${index === game.players.length - 1 ? 'last' : ''}`}
          >
            <div className="user-score-card">
              <div
                className="profile-button user-with-badge"
                onClick={() => {
                  if (p.user.id === Connection.instance.me!.id) {
                    PopupMediator.open(PopupProfile);
                  } else {
                    PopupMediator.open(PopupProfile, {
                      id: p.user.id
                    });
                  }
                }}
              >
                {p.user.username && (
                  <img
                    className="avatar"
                    src={
                      'assets/' + getItemById(p.user.currentAvatar)?.value.url
                    }
                    alt=""
                  />
                )}
                {p.user.isGuest && <span className="badge guest">Guest</span>}
                <p>{p.user.username}</p>
              </div>

              {/* <p>{`${index}/${game.players.length - 1}`}</p> */}
              <div className="score-group h-group">
                <p className="score">{p.points}</p>
                {p.rewards && (
                  <div className="v-group">
                    <div className="reward-group">
                      <p className="score-gold">{`+${p.rewards.gold}`}</p>
                      <img src="assets/icons/coin.png" alt="" />
                    </div>
                    <div className="reward-group">
                      <p className="score-experience">{`+${p.rewards.experience} XP`}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
