import Item, { getItemById } from './item';

export enum OnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

export class User {
  id?: string;
  isGuest?: boolean;
  username?: string;
  currentAvatar?: string;
  level?: number;
  status?: OnlineStatus.ONLINE | OnlineStatus.OFFLINE;
}

export class Me extends User {
  email?: string;
  currentSkin?: string;
  currentWallpaper?: string;
  gold?: number;
  experience?: number;
  friends?: User[];
  friendRequestsIncoming?: User[];
  friendRequestsOutgoing?: User[];
  inventory?: string[]; // Item IDs
  gameID?: string | null;

  public getItems(): Item[] {
    return this.inventory!.map((itemId) => getItemById(itemId)!);
  }
}

export let me: Me = new Me();
