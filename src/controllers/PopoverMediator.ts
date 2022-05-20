import EventEmitter from 'events';
import { ReactElement } from 'react';

export enum PopoverMediatorEventType {
  TOGGLE = 'toggle',
  CLOSE = 'close',
  OPEN = 'open'
}

export enum PopoverType {
  FRIENDS = 'friends',
  CHAT = 'chat',
  GOLD = 'gold',
  LEVEL = 'level'
}

export enum PopoverPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

export default class PopoverMediator extends EventEmitter {
  private static _instance: PopoverMediator;
  public static isChatOpen: boolean = false;

  private constructor() {
    // Private constructor to enforce singleton
    super();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static toggle(type: PopoverType) {
    this.instance.emit(PopoverMediatorEventType.TOGGLE, type);
  }

  public static open(
    type: PopoverType,
    anchor: ReactElement,
    position: PopoverPosition
  ) {
    console.log('type', PopoverMediator.isChatOpen);
    PopoverMediator.instance.emit(PopoverMediatorEventType.OPEN, type);
  }

  public static close(type: PopoverType) {
    console.log('type', PopoverMediator.isChatOpen);
    PopoverMediator.instance.emit(PopoverMediatorEventType.CLOSE, type);
  }
}
