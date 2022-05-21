import axios from 'axios';
import EventEmitter from 'events';
import { PopupError } from '../components/popups/PopupError';
import { PopupLoading } from '../components/popups/PopupLoading';
import { me, myUserId } from '../data/user';
import PopupMediator from './popupMediator';
import Terminal, { TerminalEventType } from './terminal';

export const VERSION: string = '1.0.0';

// eslint-disable-next-line no-restricted-globals
export const DEV_MODE: boolean = location.hostname === 'localhost';
export const SERVER_URL: string = 'http://localhost:3000/';
export const AUTH_URL: string = 'http://localhost:3001/';

// Token
let REFRESH_TOKEN: string;
let TOKEN_KEY: string;

export default class Connection extends EventEmitter {
  private static _instance: Connection;

  private constructor() {
    super();

    this.addTerminalListeners();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private error(title: string, message: string) {
    Terminal.log('❌', title);
    PopupMediator.open(PopupError, {
      title: title,
      message: message
    });
  }

  // public login(
  //   email: string | null,
  //   password: string | null,
  //   staySignedIn: boolean = false
  // ) {
  //   PopupMediator.open(PopupLoading);

  //   if ((email || password) && !(email && password))
  //     return Terminal.log(
  //       '⚠️',
  //       'Both an email and a password are required to login'
  //     );

  //   Terminal.log(
  //     '🔑',
  //     'Logging in',
  //     email && password ? `${email} / ${password}` : 'anonymously',
  //     '...'
  //   );

  //   axios
  //     .post(
  //       SERVER_URL + 'login',
  //       email && password
  //         ? { email: email, password: password }
  //     )
  //     .then((res) => {
  //       const userId = res.data;
  //       if (!userId) {
  //         this.error('Login failed', 'Invalid username or password.');
  //         localStorage.removeItem('login');
  //         return;
  //       }

  //       Terminal.log('✔️ Logged in as', userId);

  //       // TODO
  //       if (staySignedIn && email && password) {
  //         // Save the refresh token to local storage
  //         localStorage.setItem('token', JSON.stringify({}));

  //         Terminal.log('🔑', 'Login credentials saved to local storage');
  //       }

  //       this.me = new PersonalUserData();
  //       this.me.id = userId;

  //       this.connect();
  //     })
  //     .catch((err) => {
  //       console.log(err.response);
  //       if (err.response.status === 401 || err.response.status === 400) {
  //         this.error('Login failed', 'Invalid username or password.');
  //         localStorage.removeItem('login');
  //       } else this.error('Login failed', `${err.code}: ${err.message}`);

  //       return;
  //     });
  // }

  // public logout() {
  //   this.disconnect();

  //   // Clear stored login credentials
  //   localStorage.removeItem('login');

  //   // Reload the page
  //   window.location.reload();
  // }

  public register(email: string, password: string) {
    PopupMediator.open(PopupLoading);

    Terminal.log('🔑', `Registering ${email} / ${password}`, '...');
    axios
      .post(SERVER_URL + 'users/registration', {
        email: email,
        password: password,
        userID: myUserId
      })
      .then((res) => {
        Terminal.log('👀', res);
        Terminal.log('✔️ Registered');

        localStorage.setItem(
          'login',
          JSON.stringify({
            email: email,
            password: password
          })
        );

        Terminal.log('🔑', 'Login credentials saved to local storage');

        PopupMediator.close();
      })
      .catch((err) => {
        Terminal.log(err);
        this.error(
          'Registration failed',
          'Could not register an account with the provided email and password.'
        );
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
      }
    });
  }
}
