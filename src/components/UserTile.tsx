import React, { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../controllers/connection';
import { me } from '../data/user';

export default function UserTile() {
  const [name, setName] = useState(me.name);
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
    setName(me.name!);
    setIsRegistered(me.isRegistered);
  }

  return (
    <div className="user-tile">
      {!isRegistered && <div className="badge">Guest</div>}
      <span>{name}</span>
    </div>
  );
}
