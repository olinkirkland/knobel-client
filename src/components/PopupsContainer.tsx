import { ComponentType, createElement, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PopupMediator, {
  PopupMediatorEventType
} from '../controllers/popupMediator';

export default function PopupsContainer() {
  useEffect(() => {
    // Popup Mediator
    const popupMediator = PopupMediator.instance;
    popupMediator.on(
      PopupMediatorEventType.OPEN,
      (props: { componentType: ComponentType; popupProps?: any }) => {
        openPopup(props.componentType, props.popupProps);
      }
    );
    popupMediator.on(PopupMediatorEventType.CLOSE, () => {
      // Close the current popup
      ReactDOM.unmountComponentAtNode(document.querySelector('.popup-frame')!);
    });
  }, []);

  function openPopup(componentType: ComponentType, popupProps: any) {
    // Unmount all children of popup-frame
    const currentPopup = document.querySelector('.popup-frame');
    console.log('closing popup:', currentPopup);
    if (currentPopup) ReactDOM.unmountComponentAtNode(currentPopup);

    // Get popup-frame element
    const popup = createElement(componentType, popupProps);
    ReactDOM.render(popup, document.querySelector('.popup-frame'));
  }

  return <div className="popup-frame"></div>;
}
