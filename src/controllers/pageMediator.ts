import EventEmitter from 'events';

export enum PageType {
  HOME = 'home-page',
  GAME = 'game-page'
}

export enum PageEvent {
  CHANGE = 'page-change'
}

export default class PageMediator extends EventEmitter {
  private static _instance: PageMediator;

  private constructor() {
    // Private constructor to enforce singleton
    super();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static open(pageType: PageType) {
    PageMediator.instance.emit(PageEvent.CHANGE, pageType);
  }
}
