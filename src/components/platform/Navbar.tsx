import Connection, { DEV_MODE } from '../../connection/Connection';
import PopupMediator from '../../controllers/PopupMediator';
import Terminal from '../../controllers/Terminal';
import { PopupShop } from '../popups/PopupShop';
import NavUserCard from './NavUserCard';
export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <button
            onClick={() => {
              Connection.instance.joinRandomGame();
            }}
            className="bar-tile logo-tile"
          >
            <h1 className="logo">Knobel Ninja</h1>
            <i className="fas fa-gamepad" />
            <span>Play</span>
          </button>
        </li>
        <li>
          <button
            className="bar-tile"
            onClick={() => {
              PopupMediator.open(PopupShop);
            }}
          > 
            <i className="fas fa-shopping-cart" />
            <span>Shop</span>
          </button>
        </li>

        {DEV_MODE && (
          <li>
            <button
              className="bar-tile"
              onClick={() => {
                Terminal.show();
              }}
            >
              <i className="fas fa-keyboard" />
              <span>Terminal</span>
            </button>
          </li>
        )}
      </ul>

      <NavUserCard />
    </nav>
  );
}
