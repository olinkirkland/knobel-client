import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { calculateExperienceNeededForNextLevel } from '../../utils';
import { PopupMe } from '../popups/PopupMe';
import ProgressBar from '../ProgressBar';

export default function Footer() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [gold, setGold] = useState(0);
  const [level, setLevel] = useState(0);
  const [experience, setExperience] = useState(0);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    onTokenChange();

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
    setGold(me.gold!);
    setLevel(me.level!);
    setExperience(me.experience!);
    setExperienceToNextLevel(
      calculateExperienceNeededForNextLevel(me.experience!)
    );
    // setUnread(me.unread!);
  }

  return (
    <footer className="taskbar">
      <div className="taskbar-group">
        <button className="btn-taskbar hide-mobile">
          <span>{`Level ${level}`}</span>
          <ProgressBar
            percent={Math.min(experience / experienceToNextLevel, 1)}
          />
        </button>
        <button className="btn-taskbar">
          <img className="" src="assets/icons/coin.png" alt="" />
          <span>{`${gold}`}</span>
        </button>
        <button className="btn-taskbar">
          <img className="" src="assets/icons/chat.png" alt="" />
          <span className="hide-mobile">Chat Room</span>
        </button>
      </div>
      <div className="taskbar-group">
        <button className="btn-taskbar  align-right disabled hide-mobile">
          <i className="fas fa-key" />
          <span>{refreshToken}</span>
        </button>
        <button
          className="btn-taskbar align-right hide-mobile"
          onClick={() => {
            Connection.instance.fetchAccessToken();
          }}
        >
          <i className="fas fa-sync-alt" />
          <span>{accessToken}</span>
        </button>
        <button
          className="btn-taskbar align-right show-mobile"
          onClick={() => {
            PopupMediator.open(PopupMe);
          }}
        >
          <span>My Profile</span>
        </button>
      </div>
    </footer>
  );
}
