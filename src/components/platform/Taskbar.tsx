import { useEffect, useState } from 'react';
import { PopupManager, PopupProvider } from 'react-popup-manager';
import Connection, {
  ConnectionEventType,
  DEV_MODE
} from '../../connection/Connection';
import PopoverMediator, {
  PopoverMediatorEventType,
  PopoverType
} from '../../controllers/PopoverMediator';
import PopupMediator from '../../controllers/PopupMediator';
import {
  experienceNeededFromLevel as experienceNeededForNextLevel,
  numberComma
} from '../../Util';
import { PopupAbout } from '../popups/PopupAbout';
import { PopupSettings } from '../popups/PopupSettings';
import ProgressBar from './ProgressBar';
export default function Taskbar() {
  const connection = Connection.instance;
  const [gold, setGold] = useState(0);
  const [level, setLevel] = useState(0);
  const [experience, setExperience] = useState(0);
  const [experienceToNextLevel, setExperienceToNextLevel] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    connection.addListener(ConnectionEventType.USER_DATA_CHANGED, () => {
      update();
    });
    connection.addListener(ConnectionEventType.CHAT_MESSAGE, () => {
      setUnread((u) => (PopoverMediator.isChatOpen ? u : u + 1));
    });

    PopoverMediator.instance.addListener(
      PopoverMediatorEventType.OPEN,
      (type: PopoverType) => {
        if (type === PopoverType.CHAT) setUnread(0);
      }
    );
  }, []);

  function update() {
    setGold(connection.me!.gold!);
    setLevel(connection.me!.level!);
    setExperience(connection.me!.experience!);
    setExperienceToNextLevel(
      experienceNeededForNextLevel(connection.me!.level!)
    );
  }

  return (
    <div className="taskbar">
      <button
        className="bar-tile"
        onClick={(event) => {
          PopoverMediator.toggle(PopoverType.LEVEL);
        }}
      >
        <span>{`Level ${level}`}</span>
        <ProgressBar
          percent={Math.min(experience / experienceToNextLevel, 1)}
        />
      </button>
      <button
        className="bar-tile"
        onClick={(event) => {
          PopoverMediator.toggle(PopoverType.GOLD);
        }}
      >
        <img className="" src="assets/icons/coin.png" alt="" />
        <span>{numberComma(gold)}</span>
      </button>
      <button
        className="bar-tile chat-tile"
        onClick={(event) => {
          PopoverMediator.toggle(PopoverType.CHAT);
          setUnread(0);
        }}
      >
        <i className="fas fa-comment-alt" />
        <span>Chat Room</span>
        {unread > 0 && <span className="chat-unread">{unread}</span>}
      </button>

      <div className="h-group no-gap align-right">
        <button
          className={`bar-tile friends ${!DEV_MODE ? 'hidden' : ''}`}
          onClick={(event) => {
            console.log(event.currentTarget as HTMLButtonElement);
            PopoverMediator.toggle(PopoverType.FRIENDS);
          }}
        >
          <i className="fas fa-user-friends" />
          <span>{`${connection.me?.friends?.length || 0} Friends`}</span>
        </button>

        <button
          className="bar-tile"
          onClick={(event) => {
            PopupMediator.open(PopupSettings);
          }}
        >
          <i className="fas fa-cog" />
        </button>
        <button
          className="bar-tile bar-tile-end"
          onClick={(event) => {
            PopupMediator.open(PopupAbout);
          }}
        >
          <i className="fas fa-info-circle" />
        </button>
      </div>
    </div>
  );
}
