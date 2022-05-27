import EventEmitter from 'events';
import { me } from '../data/user';
import { formatHelpString } from '../utils';

const helpCommands = [
  ['clear', 'Clear the terminal'],
  ['help', 'Show this help message'],
  ['login', 'Login [email, password]'],
  ['register', 'Register [email, password]'],
  ['logout', 'Logout'],
  ['chat', 'Send a chat message to the general-chat [message]']
];

export enum TerminalEventType {
  LOG = 'log',
  COMMAND = 'command'
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
        Terminal.log(`🗃️ Inventory (${me.inventory?.length})`, me.inventory);
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
