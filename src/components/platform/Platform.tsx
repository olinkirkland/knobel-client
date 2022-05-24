import { useEffect, useState } from 'react';
import PageMediator, {
  PageEvent,
  PageType
} from '../../controllers/pageMediator';
import Footer from './Footer';
import GamePage from './GamePage';
import HomePage from './HomePage';
import Nav from './Nav';

export default function Platform() {
  const [page, setPage] = useState<PageType>(PageType.HOME);

  useEffect(() => {
    PageMediator.instance.addListener(PageEvent.CHANGE, setPage);

    return () => {
      PageMediator.instance.removeListener(PageEvent.CHANGE, setPage);
    };
  }, []);

  return (
    <div className="platform">
      <Nav />
      {page === PageType.HOME && <HomePage />}
      {page === PageType.GAME && <GamePage />}
      <Footer />
    </div>
  );
}
