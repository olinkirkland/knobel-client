import EventEmitter from 'events';
import Connection from '../connection/Connection';
import { formatHelpString } from '../Util';

const helpCommands = [
  ['clear', 'Clear the terminal'],
  ['help', 'Show this help message'],
  ['login', 'Login [email, password]'],
  ['register', 'Register [email, password]'],
  ['logout', 'Logout'],
  ['cheat', 'Set a resource [resource, amount]'],
  ['chat', 'Send a chat message to the general-chat [message]'],
  ['inventory, inv', 'View your inventory'],
  ['game/host, gh', 'Host a game with default settings'],
  ['game/join, gj', 'Join a game [gameId]'],
  ['send', 'Send a custom event and payload to the backend [event, payload]']
];

export enum TerminalEventType {
  LOG = 'log',
  COMMAND = 'command',
  SHOW = 'show',
  HIDE = 'hide'
}

export default class Terminal extends EventEmitter {
  private static _instance: Terminal;
  public static logs: TerminalLog[] = [];

  private constructor() {
    // Private constructor to enforce singleton
    super();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static show() {
    Terminal.instance.emit(TerminalEventType.SHOW);
  }

  public static hide() {
    Terminal.instance.emit(TerminalEventType.HIDE);
  }

  public static log(...args: any[]): void {
    console.log(...args);

    const log = new TerminalLog(...args);
    Terminal.logs.push(log);
    Terminal.instance.emit(TerminalEventType.LOG, log);
  }

  public static command(cmd: string): void {
    const log = new TerminalLog(cmd);
    log.cmd = true;
    Terminal.logs.push(log);

    switch (cmd) {
      case 'clear':
        Terminal.clear();
        return;
      case 'inventory':
      case 'inv':
        Terminal.log(
          `🗃️ Inventory (${Connection.instance.me?.inventory?.length})`,
          Connection.instance.me?.inventory
        );
        return;
      case 'help':
        Terminal.log(
          '📖 Terminal Commands',
          `\n${helpCommands
            .map((arr) => formatHelpString(arr[0], arr[1]))
            .join('\n')}`
        );
        return;
      default:
        break;
    }

    Terminal.instance.emit(TerminalEventType.LOG, log);
    Terminal.instance.emit(TerminalEventType.COMMAND, cmd);
  }

  public static clear() {
    Terminal.logs = [];
    Terminal.instance.emit(TerminalEventType.LOG);
  }
}

export class TerminalLog {
  public message: string;
  public time: Date;
  public cmd: boolean = false;

  constructor(...args: any[]) {
    this.message = args
      .map((u) =>
        typeof u === 'string' || typeof u === 'number' || typeof u === 'boolean'
          ? u
          : JSON.stringify(u)
      )
      .join(' ');
    this.time = new Date();
  }
}
