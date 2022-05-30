import EventEmitter from 'events';
import { ComponentType } from 'react';

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

  public static open(componentType: ComponentType<any>, popupProps?: any) {
    console.log('Opening popup', componentType, popupProps);
    PopupMediator.instance.emit(PopupMediatorEventType.OPEN, {
      componentType: componentType,
      popupProps: popupProps
    });
  }

  public static close() {
    PopupMediator.instance.emit(PopupMediatorEventType.CLOSE);
  }
}
