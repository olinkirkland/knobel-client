import axios from 'axios';
import EventEmitter from 'events';
import { PopupError } from '../components/popups/PopupError';
import { PopupLoading } from '../components/popups/PopupLoading';
import { me } from '../data/user';
import PopupMediator from './popupMediator';
import Terminal, { TerminalEventType } from './terminal';

export const VERSION: string = '1.0.0';

// eslint-disable-next-line no-restricted-globals
export const DEV_MODE: boolean = location.hostname === 'localhost';
export const SERVER_URL: string = 'http://localhost:3000/';
export const AUTH_URL: string = 'http://localhost:3001/';

export enum ConnectionEventType {
  ACCESS_TOKEN_CHANGED = 'accessTokenChanged'
}

export default class Connection extends EventEmitter {
  private static _instance: Connection;

  // Token
  public refreshToken?: string;
  public accessToken?: string;

  private constructor() {
    super();

    this.addTerminalListeners();

    this.start();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public start() {
    // Check if there is a refresh token in local storage
    // Either login as guest or load the refresh token
    const storedRefreshToken = localStorage.getItem('refresh-token');
    if (storedRefreshToken) {
      Terminal.log('🔑', 'Refresh token found in local storage');
      this.refreshToken = storedRefreshToken;
      this.fetchAccessToken();
    } else {
      Terminal.log('🔑', 'No refresh token found in local storage');
      this.login(null, null);
    }
  }

  async fetchAccessToken() {
    Terminal.log('🔑', 'Fetching access token', '...');
    await axios
      .post(AUTH_URL + 'token', { refreshToken: this.refreshToken })
      .then((res) => {
        Terminal.log('✔️ Access token fetched');
        this.accessToken = res.data.accessToken;
        me.id = res.data.id;
        this.emit(ConnectionEventType.ACCESS_TOKEN_CHANGED);
      })
      .catch((err) => {
        Terminal.log('❌', `${err.code}: ${err.message}`);
      });
  }

  public login(email: string | null, password: string | null) {
    PopupMediator.open(PopupLoading);

    Terminal.log(
      '🔑',
      'Logging in',
      email && password ? `${email} / ${password}` : 'anonymously',
      '...'
    );

    axios
      .post(
        AUTH_URL + 'login',
        email && password ? { email: email, password: password } : null
      )
      .then((res) => {
        const userId = res.data.id;

        if (!userId) {
          PopupMediator.open(PopupError, {
            title: 'Login failed',
            message: 'Could not login with the provided credentials.'
          });
          localStorage.removeItem('refresh-token');
          return;
        }

        Terminal.log('✔️ Logged in as', userId);

        this.refreshToken = res.data.refreshToken;
        this.accessToken = res.data.accessToken;
        Object.assign(me, { id: userId });
        this.emit(ConnectionEventType.ACCESS_TOKEN_CHANGED);

        // Save the refresh token to local storage
        localStorage.setItem('refresh-token', this.refreshToken!);
        PopupMediator.close();
      })
      .catch((err) => {
        console.log(err.response);
        localStorage.removeItem('refresh-token');
        PopupMediator.open(PopupError, {
          title: 'Login failed',
          message: `${err.code}: ${err.message}`
        });

        return;
      });
  }

  public logout() {
    // Clear stored refresh token
    localStorage.removeItem('refresh-token');

    axios
      .post(AUTH_URL + 'logout', {
        refreshToken: this.refreshToken
      })
      .then((res) => {
        Terminal.log('✔️ Logged out');
      });

    // Reload the page
    window.location.reload();
  }

  public register(email: string, password: string) {
    PopupMediator.open(PopupLoading);

    Terminal.log('🔑', `Registering ${email} / ${password}`, '...');
    axios
      .post(AUTH_URL + 'register', {
        email: email,
        password: password
      })
      .then((res) => {
        Terminal.log('✔️ Registered');

        localStorage.setItem(
          'refresh-token',
          JSON.stringify(this.refreshToken)
        );

        Terminal.log('🔑', 'Login credentials saved to local storage');
        PopupMediator.close();
      })
      .catch((err) => {
        PopupMediator.open(PopupError, {
          title: 'Registration failed',
          message: `${err.code}: ${err.message}`
        });

        return;
      });
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
      }
    });
  }
}
