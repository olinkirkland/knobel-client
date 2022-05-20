export default interface User {
  // User-sm
  id: string;
  username: string;
  currentAvatar: string;
  level: number;
  isGuest: boolean;
  isOnline: boolean;
  status: string;

  // User-md

  // User-fl
}

export const systemUser: User = {
  id: 'system',
  username: 'FallBot',
  status: '',
  currentAvatar: 'system-avatar',
  level: -1,
  isGuest: false,
  isOnline: false
};
