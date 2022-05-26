import React, { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../controllers/connection';
import { getItemById } from '../data/item';
import { me } from '../data/user';

export default function UserTile() {
  const [name, setName] = useState(me.name);
  const [avatar, setAvatar] = useState(me.avatar);
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
    setAvatar(me.avatar!);
    setIsRegistered(me.isRegistered);
  }

  return (
    <div className="user-tile">
      <img
        className="user-tile-avatar"
        src={`assets/${getItemById(avatar!)?.value.url}`}
        alt=""
      />
      {!isRegistered && <div className="badge">Guest</div>}
      <span>{name}</span>
    </div>
  );
}
