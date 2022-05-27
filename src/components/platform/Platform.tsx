import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PageMediator, {
  PageEvent,
  PageType
} from '../../controllers/pageMediator';
import { getItemById } from '../../data/item';
import { me } from '../../data/user';
import Footer from './Footer';
import GamePage from './GamePage';
import HomePage from './HomePage';
import Nav from './Nav';

export default function Platform() {
  const [page, setPage] = useState<PageType>(PageType.HOME);
  const [wallpaper, setWallpaper] = useState(me.wallpaper);

  useEffect(() => {
    PageMediator.instance.addListener(PageEvent.CHANGE, setPage);
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChanged
    );

    return () => {
      PageMediator.instance.removeListener(PageEvent.CHANGE, setPage);

      Connection.instance.removeListener(
        ConnectionEventType.USER_DATA_CHANGED,
        onUserDataChanged
      );
    };
  }, []);

  function onUserDataChanged() {
    setWallpaper(me.wallpaper);
  }

  return (
    <div
      className="platform"
      style={{
        background: `url(${process.env.PUBLIC_URL}/assets/${
          getItemById(wallpaper!)?.value.url
        }) repeat center center`
      }}
    >
      <Nav />
      {page === PageType.HOME && <HomePage />}
      {page === PageType.GAME && <GamePage />}
      <Footer />
    </div>
  );
}
