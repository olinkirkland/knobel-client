import { User } from './user';

export default interface Chat {
  user: User;
  message: string;
  time: number;
}
