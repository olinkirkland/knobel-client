import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PageMediator, { PageType } from '../../controllers/pageMediator';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { PopupLogin } from '../popups/PopupLogin';
import { PopupMe } from '../popups/PopupMe';
import { PopupPrompt } from '../popups/PopupPrompt';
import { PopupRegister } from '../popups/PopupRegister';
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
          <img className="logo" src="assets/images/logo.png" alt="logo" />
          <i className="fas fa-home" />
        </button>
        <button
          className="btn-taskbar hide-mobile"
          onClick={() => {
            PageMediator.open(PageType.GAME);
          }}
        >
          <span>Play Now</span>
        </button>
        <button className="btn-taskbar hide-mobile">
          <span>Shop</span>
        </button>
      </div>
      <div className="taskbar-group hide-mobile">
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
