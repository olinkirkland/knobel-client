import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../connection/Connection';
import PopupMediator from '../../controllers/PopupMediator';
import { getItemById } from '../../models/Item';
import { PopupLogin } from '../popups/PopupLogin';
import { PopupProfile } from '../popups/PopupProfile';
import { PopupPrompt } from '../popups/PopupPrompt';
import { PopupRegister } from '../popups/PopupRegister';
export default function NavAnonCard() {
  const connection = Connection.instance;
  const [username, setUsername] = useState<string>('');
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<string>('');

  useEffect(() => {
    connection.on(ConnectionEventType.USER_DATA_CHANGED, () => {
      setUsername(connection.me!.username!);
      setIsGuest(connection.me!.isGuest === true);
      setAvatar(connection.me!.currentAvatar!);
    });
  }, []);

  return (
    <>
      <div className="nav-user-card">
        <div
          className="profile-button user-with-badge"
          onClick={() => PopupMediator.open(PopupProfile)}
        >
          {username && (
            <img
              className="avatar"
              src={'assets/' + getItemById(avatar)?.value.url}
              alt=""
            />
          )}
          {isGuest && <span className="badge guest">Guest</span>}
          <h2>{username}</h2>
        </div>
        {isGuest && (
          <button
            className="user-card-button"
            onClick={() => PopupMediator.open(PopupLogin)}
          >
            <span>Login</span>
          </button>
        )}

        {isGuest && (
          <button
            className="user-card-button featured"
            onClick={() => PopupMediator.open(PopupRegister)}
          >
            <span>Sign Up</span>
          </button>
        )}

        {!isGuest && (
          <button
            className="user-card-button"
            onClick={() =>
              PopupMediator.open(PopupPrompt, {
                title: 'Log out',
                message: 'Are you sure you want to log out?',
                confirm: 'Yes, log me out',
                cancel: 'No',
                onConfirm: () => {
                  connection.logout();
                },
                onCancel: () => {}
              })
            }
          >
            <span>Logout</span>
          </button>
        )}
      </div>
    </>
  );
}
