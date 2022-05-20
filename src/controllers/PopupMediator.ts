import EventEmitter from 'events';
import { OpenPopupOptions } from 'react-popup-manager/dist/src/__internal__/popupManagerInternal';

export enum PopupMediatorEventType {
  OPEN = 'open',
  CLOSE = 'close'
}

export default class PopupMediator extends EventEmitter {
  private static _instance: PopupMediator;

  private constructor() {
    // Private constructor to enforce singleton
    super();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static open<T>(
    componentClass: React.ComponentType<T>,
    popupProps?: OpenPopupOptions<T>
  ) {
    PopupMediator.instance.emit(PopupMediatorEventType.OPEN, {
      componentClass: componentClass,
      popupProps: popupProps
    });
  }

  public static close() {
    PopupMediator.instance.emit(PopupMediatorEventType.CLOSE);
  }
}
