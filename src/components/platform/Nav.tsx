import PopupMediator from '../../controllers/popupMediator';
import { PopupLogin } from '../popups/PopupLogin';
import { PopupRegister } from '../popups/PopupRegister';
import { PopupTerminal } from '../popups/PopupTerminal';

export default function Nav() {
  return (
    <nav className="taskbar">
      <div className="taskbar-group">
        <button className="btn-taskbar">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </button>
        <button className="btn-taskbar">
          <i className="fas fa-gamepad"></i>
          <span>Play</span>
        </button>
        <button className="btn-taskbar">
          <i className="fas fa-shopping-cart"></i>
          <span>Shop</span>
        </button>
        <button
          className="btn-taskbar"
          onClick={() => {
            PopupMediator.open(PopupTerminal);
          }}
        >
          <i className="fas fa-keyboard"></i>
          <span>Terminal</span>
        </button>
      </div>
      <div className="taskbar-group">
        <button
          className="btn-taskbar align-right"
          onClick={() => {
            PopupMediator.open(PopupLogin);
          }}
        >
          Login
        </button>
        <button
          className="btn-taskbar align-right"
          onClick={() => {
            PopupMediator.open(PopupRegister);
          }}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}
