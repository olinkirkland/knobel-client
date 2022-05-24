import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { PopupMe } from '../popups/PopupMe';

export default function Footer() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    onTokenChange();
    onUserDataChange();

    Connection.instance.addListener(
      ConnectionEventType.ACCESS_TOKEN_CHANGED,
      onTokenChange
    );

    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChange
    );

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.ACCESS_TOKEN_CHANGED,
        onTokenChange
      );

      Connection.instance.removeListener(
        ConnectionEventType.USER_DATA_CHANGED,
        onUserDataChange
      );
    };
  }, []);

  function onTokenChange() {
    const s = Connection.instance.accessToken!;
    if (s) setAccessToken(s.substring(s.length - 8, s.length));
    const t = Connection.instance.refreshToken!;
    if (t) setRefreshToken(t.substring(t.length - 8, t.length));
  }

  function onUserDataChange() {
    setName(me.name!);
  }

  return (
    <footer className="taskbar">
      <div className="taskbar-group">
        <button className="btn-taskbar disabled">
          <i className="fas fa-key" />
          <span>{refreshToken}</span>
        </button>
        <button
          className="btn-taskbar"
          onClick={() => {
            Connection.instance.fetchAccessToken();
          }}
        >
          <i className="fas fa-sync-alt" />
          <span>{accessToken}</span>
        </button>
        <button
          className="btn-taskbar"
          onClick={() => {
            PopupMediator.open(PopupMe);
          }}
        >
          <i className="fas fa-user" />
          <span>{name}</span>
        </button>
      </div>
      <div className="taskbar-group">
        <button className="btn-taskbar align-right">Foo</button>
        <button className="btn-taskbar align-right">Bar</button>
      </div>
    </footer>
  );
}
