import Connection from '../../connection/Connection';
import PopupMediator from '../../controllers/PopupMediator';
import { PopupHostGame } from '../popups/PopupHostGame';
import { PopupJoinGame } from '../popups/PopupJoinGame';
import { PopupShop } from '../popups/PopupShop';
import HomePanel from './HomePanel';

export default function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-grid">
          <HomePanel
            onClick={() => {
              PopupMediator.open(PopupShop);
            }}
            titleText="Avatars &amp; Wallpapers"
            buttonText="Shop"
            image="assets/images/abstract-2.png"
          />
          <HomePanel
            onClick={() => {
              Connection.instance.joinRandomGame();
            }}
            titleText="Play Now &amp; Join a Random Match"
            buttonText="Play Now"
            image="assets/images/abstract-1.png"
            big={true}
          />
          <HomePanel
            onClick={() => {
              PopupMediator.open(PopupHostGame);
            }}
            titleText="Play with friends"
            buttonText="Host a game"
            image="assets/images/abstract-4.png"
          />
          <HomePanel
            onClick={() => {
              PopupMediator.open(PopupJoinGame);
            }}
            titleText="View open games"
            buttonText="Join a game"
            image="assets/images/abstract-5.png"
          />
        </div>
      </div>
    </div>
  );
}
