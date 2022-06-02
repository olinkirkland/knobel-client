import { User } from './user';

export default interface Game {
  id: string;
  name: string;
  host: User;
  players: User[];
}
