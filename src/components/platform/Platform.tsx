import { useEffect, useState } from 'react';
import Connection, {
  ConnectionEventType,
  VERSION
} from '../../connection/Connection';
import PopoverMediator, {
  PopoverMediatorEventType,
  PopoverType
} from '../../controllers/PopoverMediator';
import { getItemById } from '../../models/Item';
import GameScreen from '../game/GameScreen';
import PopoverChat from '../popovers/PopoverChat';
import PopoverFriends from '../popovers/PopoverFriends';
import PopoverGold from '../popovers/PopoverGold';
import PopoverLevel from '../popovers/PopoverLevel';
import Home from './Home';
import Navbar from './Navbar';
import Taskbar from './Taskbar';

enum SCREEN_TYPE {
  HOME = 'home',
  GAME = 'game'
}

export default function Platform() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGoldOpen, setIsGoldOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<SCREEN_TYPE>(
    SCREEN_TYPE.HOME
  );

  const [wallpaper, setWallpaper] = useState(
    Connection.instance.me?.currentWallpaper
  );

  useEffect(() => {
    Connection.instance.on(ConnectionEventType.USER_DATA_CHANGED, () => {
      setCurrentScreen(
        Connection.instance.me?.gameID ? SCREEN_TYPE.GAME : SCREEN_TYPE.HOME
      );

      setWallpaper(Connection.instance.me?.currentWallpaper);
    });

    addPopoverMediatorListeners();
  }, []);

  useEffect(() => {
    PopoverMediator.isChatOpen = isChatOpen;
  }, [isChatOpen]);

  function addPopoverMediatorListeners() {
    PopoverMediator.instance.on(
      PopoverMediatorEventType.OPEN,
      (type: PopoverType) => openOrClosePopover(type, true)
    );

    PopoverMediator.instance.on(
      PopoverMediatorEventType.CLOSE,
      (type: PopoverType) => openOrClosePopover(type, false)
    );

    PopoverMediator.instance.on(
      PopoverMediatorEventType.TOGGLE,
      (type: PopoverType) => togglePopover(type)
    );
  }

  function openOrClosePopover(type: PopoverType, value: boolean) {
    if (type === PopoverType.FRIENDS) {
      setIsFriendsOpen(value);
      return;
    }

    // Only one left-aligned popover at a time
    if (type === PopoverType.CHAT) setIsChatOpen(value);
    else setIsChatOpen(false);
    if (type === PopoverType.GOLD) setIsGoldOpen(value);
    else setIsGoldOpen(false);
    if (type === PopoverType.LEVEL) setIsLevelOpen(value);
    else setIsLevelOpen(false);
  }

  function togglePopover(type: PopoverType) {
    if (type === PopoverType.FRIENDS) {
      setIsFriendsOpen((value) => !value);
      return;
    }

    if (type === PopoverType.CHAT) setIsChatOpen((value) => !value);
    else setIsChatOpen(false);
    if (type === PopoverType.GOLD) setIsGoldOpen((value) => !value);
    else setIsGoldOpen(false);
    if (type === PopoverType.LEVEL) setIsLevelOpen((value) => !value);
    else setIsLevelOpen(false);
  }

  return (
    <>
      <Navbar />
      <div
        className="home-popover-container"
        style={{
          background: `url(${process.env.PUBLIC_URL}/assets/${
            getItemById(wallpaper!)?.value.url
          }) repeat center center`
        }}
      >
        {currentScreen === SCREEN_TYPE.HOME && <Home />}
        {currentScreen === SCREEN_TYPE.GAME && <GameScreen />}
        <div className="popover-container">
          {isChatOpen && <PopoverChat />}
          {isGoldOpen && <PopoverGold />}
          {isLevelOpen && <PopoverLevel />}
          {isFriendsOpen && <PopoverFriends />}
          <span className="version">version {VERSION}</span>
        </div>
      </div>
      <Taskbar />
    </>
  );
}
