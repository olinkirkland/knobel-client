import axios from 'axios';
import EventEmitter from 'events';
import { Socket } from 'socket.io-client';
import Terminal from '../controllers/Terminal';
import Connection, { mouseCoords, MyUserData, url } from './Connection';

export enum GameCategory {
  GENERAL_KNOWLEDGE = 9,
  BOOKS = 10,
  FILM = 11,
  MUSIC = 12,
  MUSICALS_AND_THEATRES = 13,
  TV = 14,
  VIDEO_GAMES = 15,
  BOARD_GAMES = 16,
  SCIENCE_AND_NATURE = 17,
  COMPUTERS = 18,
  MATHEMATICS = 19,
  MYTHOLOGY = 20,
  SPORTS = 21,
  GEOGRAPHY = 22,
  HISTORY = 23,
  POLITICS = 24,
  ART = 25,
  CELEBRITIES = 26,
  ANIMALS = 27,
  VEHICLES = 28,
  COMICS = 29,
  GADGETS = 30,
  ANIME_AND_MANGA = 31,
  CARTOON_AND_ANIMATIONS = 32
}

export const gameCategoryNames = [
  { id: GameCategory.GENERAL_KNOWLEDGE, name: 'General Knowledge' },
  { id: GameCategory.BOOKS, name: 'Books' },
  { id: GameCategory.FILM, name: 'Film' },
  { id: GameCategory.MUSIC, name: 'Music' },
  { id: GameCategory.MUSICALS_AND_THEATRES, name: 'Musicals & Theatres' },
  { id: GameCategory.TV, name: 'TV' },
  { id: GameCategory.VIDEO_GAMES, name: 'Video Games' },
  { id: GameCategory.BOARD_GAMES, name: 'Board Games' },
  { id: GameCategory.SCIENCE_AND_NATURE, name: 'Science & Nature' },
  { id: GameCategory.COMPUTERS, name: 'Computers' },
  { id: GameCategory.MATHEMATICS, name: 'Mathematics' },
  { id: GameCategory.MYTHOLOGY, name: 'Mythology' },
  { id: GameCategory.SPORTS, name: 'Sports' },
  { id: GameCategory.GEOGRAPHY, name: 'Geography' },
  { id: GameCategory.HISTORY, name: 'History' },
  { id: GameCategory.POLITICS, name: 'Politics' },
  { id: GameCategory.ART, name: 'Art' },
  { id: GameCategory.CELEBRITIES, name: 'Celebrities' },
  { id: GameCategory.ANIMALS, name: 'Animals' },
  { id: GameCategory.VEHICLES, name: 'Vehicles' },
  { id: GameCategory.COMICS, name: 'Comics' },
  { id: GameCategory.GADGETS, name: 'Gadgets' },
  { id: GameCategory.ANIME_AND_MANGA, name: 'Anime & Manga' },
  { id: GameCategory.CARTOON_AND_ANIMATIONS, name: 'Cartoon & Animations' }
];

export type GameOptions = {
  name: string;
  description: string;
  password: string;
  categories: number[];
};

export enum GameEventType {
  INVALIDATE = 'invalidate-game', // BE -> FE Invalidate game data (tells front-end to refresh)
  SETUP = 'game-round-setup', // BE -> FE Send information for the current game round, e.g. Questions
  RESULT = 'game-round-result', // BE -> FE Send Results from the Round to FE. Also start next round or goto END
  END = 'game-ended', // BE -> FE Send information about the round, e.g. Ranking for the ended Round
  GAME_DATA_CHANGED = 'game-data-changed', // FE-INTERNAL Game data changed
  MOVE_CURSOR = 'game-move-cursor', // FE -> BE -> FE Move the cursor
  GAME_TICK = 'game-tick' // BE -> FE Tick the game
}

export enum GameMode {
  LOBBY = 'mode-lobby',
  GAME = 'mode-game'
}

interface PlayerCoordinates {
  [key: string]: { x: number; y: number };
}

export default class Game extends EventEmitter {
  // Callbacks
  moveInterval: NodeJS.Timer;
  setIsConnected!: Function;
  socket: Socket;
  me: MyUserData;
  id: string;

  mode?: GameMode = GameMode.LOBBY;
  name: any;
  hostId: any;
  roundIndex: any;
  players: any;
  maxPlayers: any;
  numberOfRounds: any;
  question?: { prompt: string; answers: string[]; correctAnswer?: number };
  playerCoordinates: PlayerCoordinates = {};
  categories: string[] = [];
  seconds: number = -1;

  public constructor(socket: Socket) {
    super();

    this.socket = socket;
    this.addSocketListeners();
    this.moveInterval = setInterval(() => {
      this.sendMoveCursorUpdate();
    }, 20);

    this.me = Connection.instance.me!;
    this.id = this.me.gameID!;
  }

  private addSocketListeners() {
    Terminal.log('Adding socket listeners');
    this.socket!.on(
      GameEventType.INVALIDATE,
      this.invalidateGameData.bind(this)
    );

    this.socket!.on(GameEventType.GAME_TICK, this.onGameTick.bind(this));
  }

  public dispose() {
    Terminal.log('🗑️ Disposing game ...');
    clearInterval(this.moveInterval);
    this.removeSocketListeners();
  }

  private removeSocketListeners() {
    Terminal.log('Removing socket listeners');
    this.socket.off(GameEventType.INVALIDATE);
    this.socket.off(GameEventType.GAME_TICK);
  }

  public answer(index: number) {
    Terminal.log('💬 Answer:', index);
    axios
      .post(
        url + 'game/answer',
        { userID: this.me?.id, answer: index },
        { withCredentials: true }
      )
      .then((res) => {
        Terminal.log('✔️', 'Answered!');
      })
      .catch((err) => {
        Terminal.log('⚠️', 'Error when answering');
      });
  }

  private onGameTick(data: PlayerCoordinates) {
    // Update the locations of all player's cursors
    this.playerCoordinates = data;
    this.emit(GameEventType.GAME_TICK);
  }

  private sendMoveCursorUpdate() {
    this.socket.emit(GameEventType.MOVE_CURSOR, {
      userID: this.me.id,
      x: mouseCoords.x,
      y: mouseCoords.y
    });
  }

  private invalidateGameData() {
    // User data invalidated, update it
    Terminal.log('🔥 Game data invalidated, validating ...');
    Terminal.log(url + `game/${this.id}`);

    axios
      .get(url + `game/${this.id}`, { withCredentials: true })
      .then((res) => {
        const data = res.data;
        // console.log(data);

        this.mode = data.gameMode;
        this.name = data.name;
        this.hostId = data.host.id;
        this.players = data.players;
        this.maxPlayers = data.maxPlayers;
        this.roundIndex = data.roundIndex;
        this.numberOfRounds = data.numberOfRounds;
        this.question = data.question;
        this.seconds = data.seconds;
        this.categories = data.categories;

        Terminal.log('✔️', 'Validated game data');

        this.emit(GameEventType.GAME_DATA_CHANGED);
      })
      .catch((err) => {
        Terminal.log('❌', 'Failed to validate game data');
        Terminal.log(err);
      });
  }
}
