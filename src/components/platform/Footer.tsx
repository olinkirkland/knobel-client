import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { me } from '../../data/user';

export default function Footer() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.ACCESS_TOKEN_CHANGED,
      onTokenChange
    );

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.ACCESS_TOKEN_CHANGED,
        onTokenChange
      );
    };
  }, []);

  function onTokenChange() {
    const s = Connection.instance.accessToken!;
    if (s) setAccessToken(s.substring(s.length - 8, s.length));
    const t = Connection.instance.refreshToken!;
    if (t) setRefreshToken(t.substring(t.length - 8, t.length));

    setId(me.id!);
  }

  return (
    <footer className="taskbar">
      <div className="taskbar-group">
        <button className="btn-taskbar disabled">
          <i className="fas fa-key" />
          <span>{refreshToken}</span>
        </button>
        <button className="btn-taskbar">
          <i className="fas fa-sync-alt" />
          <span>{accessToken}</span>
        </button>
        <button className="btn-taskbar">
          <i className="fas fa-user" />
          <span>{id}</span>
        </button>
      </div>
      <div className="taskbar-group">
        <button className="btn-taskbar">Foo</button>
        <button className="btn-taskbar">Bar</button>
      </div>
    </footer>
  );
}
