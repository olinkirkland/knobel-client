import React from 'react';
import { useEffect } from 'react';
import { usePopupManager } from 'react-popup-manager';
import { OpenPopupOptions } from 'react-popup-manager/dist/src/__internal__/popupManagerInternal';
import Platform from './components/platform/Platform';
import { PopupLoading } from './components/popups/PopupLoading';
import Connection from './controllers/connection';
import PopupMediator, {
  PopupMediatorEventType
} from './controllers/popupMediator';
import { garbageCollectModals } from './utils';

export default function App() {
  const popupManager = usePopupManager();

  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Popup Mediator
    const popupMediator = PopupMediator.instance;
    popupMediator.on(PopupMediatorEventType.OPEN, openPopup);
    popupMediator.on(PopupMediatorEventType.CLOSE, () => {
      setIsInitialized(true);
      popupManager.closeAll();
    });

    PopupMediator.open(PopupLoading, { isOpaque: true });

    // Establish a connection
    const connection = Connection.instance;
    connection.initialize();
  }, []);

  function openPopup<T>(props: {
    componentClass: React.ComponentType<T>;
    popupProps?: OpenPopupOptions<T>;
  }) {
    popupManager.closeAll();
    popupManager.open(props.componentClass, props.popupProps);
    garbageCollectModals();
  }

  return <>{isInitialized && <Platform />}</>;
}
