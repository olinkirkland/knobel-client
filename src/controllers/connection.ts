import axios from 'axios';
import EventEmitter from 'events';
import { connect, Socket } from 'socket.io-client';
import { PopupError } from '../components/popups/PopupError';
import PopupLoading from '../components/popups/PopupLoading';
import { PopupSuccess } from '../components/popups/PopupSuccess';
import Chat from '../data/chat';
import { me } from '../data/user';
import PopupMediator from './popupMediator';
import Terminal, { TerminalEventType } from './terminal';

export const VERSION: string = '1.0.0';

// eslint-disable-next-line no-restricted-globals
export const DEV_MODE: boolean = location.hostname === 'localhost';
export const AUTH_URL: string = 'https://knobel-auth.herokuapp.com/';
// export const SERVER_URL: string = 'https://knobel-main.herokuapp.com/';
export const SERVER_URL: string = 'http://localhost:3000/';

export enum ConnectionEventType {
  ACCESS_TOKEN_CHANGED = 'accessTokenChanged',
  USER_DATA_CHANGED = 'userDataChanged',
  CHAT_MESSAGE = 'CHAT_MESSAGE'
}

export default class Connection extends EventEmitter {
  private static _instance: Connection;

  // Token
  public refreshToken?: string;
  public accessToken?: string;

  // Socket
  private socket!: Socket;
  public chats: Chat[] = [];

  private constructor() {
    super();

    axios.defaults.withCredentials = true;
  }

  public initialize() {
    this.addTerminalListeners();
    this.addInterceptors();
    this.start();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private addInterceptors() {
    axios.interceptors.request.use((config) => {
      if (!this.accessToken) return config;
      if (!config) config = {};

      config!.headers!.Authorization = `Bearer ${this.accessToken}`;
      return config;
    });

    axios.interceptors.response.use(
      (res) => {
        return res;
      },
      async (error) => {
        if (error.response) {
          if (error.response.status === 403) {
            Terminal.log('🔑', 'Access token rejected');
            await this.fetchAccessToken();
            const config = error.config;
            config.headers['Authorization'] = `Bearer ${this.accessToken}`;
            return axios(config);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async start() {
    // Check if there is a refresh token in local storage
    // Either login as guest or load the refresh token
    const storedRefreshToken = localStorage.getItem('refresh-token');
    if (storedRefreshToken) {
      Terminal.log('🔑', 'Refresh token found in local storage');
      this.refreshToken = storedRefreshToken;
      me.id = await this.fetchAccessToken();
      this.connect();
    } else {
      Terminal.log('🔑', 'No refresh token found in local storage');
      this.login(null, null);
    }
  }

  async fetchAccessToken() {
    Terminal.log('🔑', 'Fetching new access token', '...');
    try {
      const res = await axios.post(AUTH_URL + 'token', {
        refreshToken: this.refreshToken
      });
      Terminal.log('✔️ Access token fetched');
      this.accessToken = res.data.accessToken;
      this.emit(ConnectionEventType.ACCESS_TOKEN_CHANGED);
      return res.data.id; // Returns user id
    } catch (err) {
      Terminal.log('❌', `${err}`);
      this.logout();
      PopupMediator.open(PopupError, {
        title: 'Invalid token',
        message: 'Logging out ...'
      });
    }
  }

  async fetchMyUserData() {
    Terminal.log('👤', 'Fetching user data', '...');
    try {
      const res = await axios.get(SERVER_URL + 'me');
      Terminal.log('✔️ User data fetched');
      Object.assign(me, res.data);
      this.emit(ConnectionEventType.USER_DATA_CHANGED);
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async joinChatRoom(roomId: string) {
    try {
      await axios.post(SERVER_URL + 'rooms/join', {
        roomId
      });
      Terminal.log('✔️ Joined chat room', roomId);
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async resendVerificationEmail() {
    await axios.get(SERVER_URL + 'me/send-verify-email');
    Terminal.log('✔️ Verification email sent');
    PopupMediator.open(PopupSuccess, {
      title: 'Verification email sent',
      message: 'Check your email.'
    });
  }

  public async verifyEmail(code: string) {
    try {
      await axios.post(SERVER_URL + 'me/verify', {
        code
      });
      Terminal.log('✔️ Email verified');
      PopupMediator.open(PopupSuccess, {
        title: 'Email verified',
        message: `Thanks for verifying your Email. Here's some free gold!`
      });
    } catch (err: any) {
      Terminal.log('❌', `${err}`);
      PopupMediator.open(PopupError, {
        title: 'Verification failed',
        message: 'Make sure you entered the correct code.'
      });
    }
  }

  public async login(email: string | null, password: string | null) {
    PopupMediator.open(PopupLoading);

    Terminal.log(
      '🔑',
      'Logging in',
      email && password ? `${email} / ${password}` : 'anonymously',
      '...'
    );

    const res = await axios.post(
      AUTH_URL + 'login',
      email && password ? { email: email, password: password } : null
    );

    try {
      if (!res.data.id) {
        PopupMediator.open(PopupError, {
          title: 'Login failed',
          message: 'Could not login with the provided credentials.'
        });
        localStorage.removeItem('refresh-token');
        return;
      }

      me.id = res.data.id;
      Terminal.log('✔️ Logged in as', me.id);

      this.refreshToken = res.data.refreshToken;
      this.accessToken = res.data.accessToken;
      this.emit(ConnectionEventType.ACCESS_TOKEN_CHANGED);

      // Save the refresh token to local storage
      localStorage.setItem('refresh-token', this.refreshToken!);
      this.connect();
    } catch (err: any) {
      localStorage.removeItem('refresh-token');
      PopupMediator.open(PopupError, {
        title: 'Login failed',
        message: err.response.data
      });
    }
  }

  private connect() {
    if (this.socket) this.socket.disconnect(); // Disconnect if already connected

    Terminal.log('🔌', 'Connecting to socket server', '...');
    this.socket = connect(SERVER_URL, {
      query: {
        token: this.refreshToken
      }
    });

    // Add socket listeners
    this.socket?.on('connect', async () => {
      Terminal.log(`✔️ Connected to ${SERVER_URL} as ${me.id}`);
      await this.fetchMyUserData();
      PopupMediator.close();
    });

    this.socket?.on('chat', (data: Chat) => {
      this.chats.push(data);
      this.emit(ConnectionEventType.CHAT_MESSAGE, data);
    });

    // On invalidate
    this.socket?.on('invalidate', () => {
      console.log('--invalidate');
      this.fetchMyUserData();
    });
  }

  public sendChatMessage(message: string) {
    console.log('💬', message);
    this.socket?.emit('chat', message);
  }

  public async logout() {
    // Clear stored refresh token
    localStorage.removeItem('refresh-token');

    await axios.post(AUTH_URL + 'logout', {
      refreshToken: this.refreshToken
    });

    Terminal.log('✔️ Logged out');

    // Reload the page
    window.location.reload();
  }

  public async register(email: string, password: string) {
    PopupMediator.open(PopupLoading);

    Terminal.log('🔑', `Registering ${email} / ${password}`, '...');
    try {
      await axios.post(AUTH_URL + 'register', {
        email: email,
        password: password
      });

      Terminal.log('✔️ Registered');

      // Automatically login
      this.login(email, password);
    } catch (err: any) {
      PopupMediator.open(PopupError, {
        title: 'Registration failed',
        message: err.response.data
      });
    }
  }

  public async buyItem(item: string) {
    Terminal.log('🛒', 'Buying item', item, '...');
    try {
      await axios.post(SERVER_URL + 'shop/buy', {
        item
      });
      Terminal.log('✔️ Bought item');
    } catch (err: any) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async editEmail(password: string, email: string) {
    Terminal.log('✏️', 'Editing Email', '...');
    try {
      await axios.post(SERVER_URL + 'me/email', {
        email: email,
        password: password
      });
      Terminal.log('✔️ Email edited');
      PopupMediator.open(PopupSuccess, {
        title: 'Email changed',
        message: `Your email was successfully changed to ${email}.`
      });
    } catch (err: any) {
      PopupMediator.open(PopupError, {
        title: `Couldn't change Email.`,
        message: err.response.data
      });
    }
  }

  public async editPassword(password: string, newPassword: string) {
    Terminal.log('✏️', 'Editing Password', '...');
    try {
      await axios.post(SERVER_URL + 'me/password', {
        password: password,
        newPassword: newPassword
      });
      Terminal.log('✔️ Password edited');
      PopupMediator.open(PopupSuccess, {
        title: 'Password changed',
        message: `Your password was successfully changed.`
      });
    } catch (err: any) {
      Terminal.log('❌', `${err}`);
      PopupMediator.open(PopupError, {
        title: `Couldn't change password.`,
        message: err.response.data
      });
    }
  }

  public async editNote(note: string) {
    Terminal.log('✏️', 'Editing Note', '...');
    try {
      await axios.post(SERVER_URL + 'me/note', {
        note: note
      });
      PopupMediator.open(PopupSuccess, {
        title: 'Status changed',
        message: `Your status was successfully changed.`
      });
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async editAvatar(avatar: string) {
    Terminal.log('✏️', 'Editing Avatar', '...');
    try {
      await axios.post(SERVER_URL + 'me/avatar', {
        avatar: avatar
      });
      Terminal.log('✔️ Avatar edited');
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async editWallpaper(wallpaper: string) {
    Terminal.log('✏️', 'Editing Wallpaper', '...');
    try {
      await axios.post(SERVER_URL + 'me/wallpaper', {
        wallpaper: wallpaper
      });
      Terminal.log('✔️ Wallpaper edited');
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  public async editName(name: string) {
    Terminal.log('✏️', 'Editing Name', '...');
    try {
      await axios.post(SERVER_URL + 'me/name', {
        name: name
      });
      Terminal.log('✔️ Name edited');
      PopupMediator.open(PopupSuccess, {
        title: 'Name changed',
        message: `Your name was successfully changed to ${name}.`
      });
    } catch (err) {
      Terminal.log('❌', `${err}`);
    }
  }

  // Terminal listeners trigger Connection functions
  private addTerminalListeners() {
    Terminal.instance.on(TerminalEventType.COMMAND, (cmd) => {
      const arr = cmd.split(' ');
      cmd = arr.shift();

      switch (cmd) {
        case 'register':
          this.register(arr[0], arr[1]);
          break;
        case 'login':
          this.login(arr[0], arr[1]);
          break;
        case 'logout':
          this.logout();
          break;
        case 'edit-email':
          this.editEmail(arr[0], arr[1]);
          break;
      }
    });
  }
}
