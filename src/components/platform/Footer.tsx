import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { text } from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { calculateExperienceNeededForNextLevel } from '../../utils';
import { PopupChatRooms as PopupChat } from '../popups/PopupChatRooms';
import { PopupSettings } from '../popups/PopupSettings';
import { PopupTerminal } from '../popups/PopupTerminal';
import ProgressBar from '../ProgressBar';

export default function Footer() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const [gold, setGold] = useState(me.gold);
  const [level, setLevel] = useState(me.level);
  const [experience, setExperience] = useState(me.experience);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(0);
  const [percentExperience, setPercentExperience] = useState(0);
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
    // setUnread(me.unread!);
  }

  useEffect(() => {
    // Update experience to next level and percent for progress bar
    const experienceNeeded = calculateExperienceNeededForNextLevel(level!);
    setExperienceToNextLevel(experienceNeeded);

    const percent = Math.min(experience! / experienceNeeded, 1);
    setPercentExperience(percent);
  }, [experience, experienceToNextLevel, level]);

  return (
    <footer className="taskbar">
      <div className="taskbar-group">
        <button className="btn-taskbar hide-mobile">
          <span>
            {text('level')}&nbsp;
            {level}
          </span>
          <ProgressBar percent={percentExperience} />
        </button>
        <button className="btn-taskbar">
          <img className="" src="assets/icons/coin.png" alt="" />
          <span>{`${gold}`}</span>
        </button>
        <button
          className="btn-taskbar"
          onClick={() => {
            PopupMediator.open(PopupChat);
          }}
        >
          <i className="fas fa-comment-alt" />
          <span className="hide-mobile">{text('chat')}</span>
        </button>
      </div>
      <div className="taskbar-group">
        {/* <button className="btn-taskbar  align-right disabled hide-mobile">
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
        </button> */}
        <button
          className="btn-taskbar align-right hide-mobile"
          onClick={() => {
            PopupMediator.open(PopupTerminal);
          }}
        >
          <i className="fas fa-keyboard"></i>
        </button>
        <button
          className="btn-taskbar align-right"
          onClick={() => {
            PopupMediator.open(PopupSettings);
          }}
        >
          <i className="fas fa-cog" />
        </button>
      </div>
    </footer>
  );
}
