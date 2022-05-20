import User from './User';

export default interface Chat {
  user: User;
  message: string;
  time: number;
}
