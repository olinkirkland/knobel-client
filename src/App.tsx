import { useEffect } from 'react';
import { usePopupManager } from 'react-popup-manager';
import { OpenPopupOptions } from 'react-popup-manager/dist/src/__internal__/popupManagerInternal';
import Platform from './components/platform/Platform';
import Connection from './controllers/connection';
import PopupMediator, {
  PopupMediatorEventType
} from './controllers/popupMediator';
import { garbageCollectModals } from './utils';

export default function App() {
  const popupManager = usePopupManager();

  useEffect(() => {
    // Popup Mediator
    const popupMediator = PopupMediator.instance;
    popupMediator.on(PopupMediatorEventType.OPEN, openPopup);
    popupMediator.on(PopupMediatorEventType.CLOSE, popupManager.closeAll);

    // Establish a connection
    const connection = Connection.instance;
  }, []);

  function openPopup<T>(props: {
    componentClass: React.ComponentType<T>;
    popupProps?: OpenPopupOptions<T>;
  }) {
    popupManager.closeAll();
    popupManager.open(props.componentClass, props.popupProps);
    garbageCollectModals();
  }

  return (
    <>
      <Platform />
    </>
  );
}
