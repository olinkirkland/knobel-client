import React, { useEffect } from 'react';
import Platform from './components/platform/Platform';
import PopupsContainer from './components/PopupsContainer';
import Connection from './controllers/connection';
import PopupMediator, {
  PopupMediatorEventType
} from './controllers/popupMediator';

export default function App() {
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    PopupMediator.instance.on(PopupMediatorEventType.CLOSE, () => {
      setIsInitialized(true);
    });

    // Establish a connection
    const connection = Connection.instance;
    connection.initialize();
  }, []);

  return (
    <>
      {isInitialized && <Platform />}
      <PopupsContainer />
    </>
  );
}
