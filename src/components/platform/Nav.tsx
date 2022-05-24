import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PageMediator, { PageType } from '../../controllers/pageMediator';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { PopupLogin } from '../popups/PopupLogin';
import { PopupMe } from '../popups/PopupMe';
import { PopupPrompt } from '../popups/PopupPrompt';
import { PopupRegister } from '../popups/PopupRegister';
import { PopupTerminal } from '../popups/PopupTerminal';
import UserTile from '../UserTile';

export default function Nav() {
  const [isRegistered, setIsRegistered] = useState(me.isRegistered);

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChange
    );

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.USER_DATA_CHANGED,
        onUserDataChange
      );
    };
  }, []);

  function onUserDataChange() {
    setIsRegistered(me.isRegistered);
  }

  return (
    <nav className="taskbar">
      <div className="taskbar-group">
        <button
          className="btn-taskbar"
          onClick={() => {
            PageMediator.open(PageType.HOME);
          }}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </button>
        <button
          className="btn-taskbar"
          onClick={() => {
            PageMediator.open(PageType.GAME);
          }}
        >
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
          className="btn-user"
          onClick={() => {
            PopupMediator.open(PopupMe);
          }}
        >
          <UserTile />
        </button>

        {(isRegistered && (
          <button
            className="btn-taskbar align-right"
            onClick={() => {
              PopupMediator.open(PopupPrompt, {
                title: 'Are you sure?',
                message: 'This will log you out.',
                confirm: 'Log Out',
                cancel: 'Cancel',
                onConfirm: () => {
                  Connection.instance.logout();
                },
                onCancel: () => {
                  PopupMediator.close();
                }
              });
            }}
          >
            Log Out
          </button>
        )) || (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
