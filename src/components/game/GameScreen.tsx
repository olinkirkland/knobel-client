import { useEffect, useState } from 'react';
import Connection from '../../connection/Connection';
import Game, {
  GameCategory,
  gameCategoryNames,
  GameEventType,
  GameMode
} from '../../connection/Game';
import { getItemById } from '../../models/Item';
import ProgressBar from '../platform/ProgressBar';
import AnswerTile from './AnswerTile';
import GameLobby from './GameLobby';
import Hint from './Hint';

export default function GameScreen() {
  const game: Game = Connection.instance.game!;

  const [mode, setMode] = useState(game.mode);
  const [roundIndex, setRoundIndex] = useState(game.roundIndex);
  const [numberOfRounds, setNumberOfRounds] = useState(game.numberOfRounds);
  const [question, setQuestion] = useState(game.question);
  const [players, setPlayers] = useState(game.players);
  const [categories, setCategories] = useState(game.categories);
  const [playerCoordinates, setPlayerCoordinates] = useState(
    game.playerCoordinates
  );
  const [myAnswerIndex, setMyAnswerIndex] = useState(-1);
  const [countdownSeconds, setCountdownSeconds] = useState(game.seconds);
  const [timeLeft, setTimeLeft] = useState(game.seconds);

  useEffect(() => {
    game.addListener(GameEventType.GAME_DATA_CHANGED, onGameDataChanged);
    game.addListener(GameEventType.GAME_TICK, onGameTick);
    console.log('mount');
    return () => {
      console.log('dispose');
      game.removeListener(GameEventType.GAME_DATA_CHANGED, onGameDataChanged);
      game.removeListener(GameEventType.GAME_TICK, onGameTick);
    };
  }, []);

  function onGameDataChanged() {
    setMode(game.mode);
    setRoundIndex(game.roundIndex);
    setNumberOfRounds(game.numberOfRounds);
    setQuestion(game.question);
    setPlayers(game.players);
    setCountdownSeconds(game.seconds > 0 ? (game.seconds - 1) * 1000 : -1);
    setCategories(game.categories);

    const myPlayer = game.players.find((p: any) => p.user.id === game.me!.id);
    setMyAnswerIndex(myPlayer.answer);
  }

  useEffect(() => {
    setTimeLeft(countdownSeconds);
  }, [countdownSeconds]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!Connection.instance.game) return;
      if (timeLeft > 0) setTimeLeft(timeLeft - 100);
    }, 100);
    return () => clearTimeout(t);
  }, [timeLeft]);

  function onGameTick() {
    setPlayerCoordinates(game.playerCoordinates);
  }

  function onClickAnswer(index: number) {
    game.answer(index);
  }

  return (
    <div className="game">
      <div className="game-panel">
        <div className="header">
          <div className="h-group center">
            <p>{game.name}</p>
            {game.hostId === Connection.instance.me!.id && (
              <span className="badge system">Host</span>
            )}
            <div className="wrap">
              {categories.map((category: string, index) => (
                <span key={index} className="badge category">
                  {
                    gameCategoryNames.find((c) => c.id === parseInt(category))
                      ?.name
                  }
                </span>
              ))}
            </div>
          </div>
          <p className="muted">{mode === GameMode.LOBBY ? 'Lobby' : 'Game'}</p>
        </div>

        <div className="game-body">
          {mode === GameMode.LOBBY && <GameLobby game={game} />}
          {mode === GameMode.GAME && (
            <>
              <div className="v-group">
                <div className="h-group">
                  {!players.find((p: any) => p.user.id === game.me!.id)
                    .isPlaying && (
                    <span className="badge system">Not playing</span>
                  )}
                  <p className="muted">{`Round ${roundIndex}/${numberOfRounds}`}</p>
                </div>
                <ProgressBar
                  percent={
                    countdownSeconds === -1
                      ? 1
                      : 1 - timeLeft / countdownSeconds
                  }
                />
              </div>
              <p className="prompt">{question?.prompt}</p>
              <ul className="answers">
                {question?.answers.map((answer, index) => (
                  <li key={index}>
                    <AnswerTile
                      text={answer}
                      selected={myAnswerIndex === index}
                      correct={
                        question?.hasOwnProperty('correctAnswer') &&
                        index === question.correctAnswer
                      }
                      incorrect={
                        question?.hasOwnProperty('correctAnswer') &&
                        index !== question.correctAnswer &&
                        myAnswerIndex === index
                      }
                      disabled={
                        question?.hasOwnProperty('correctAnswer') ||
                        !players.find((p: any) => p.user.id === game.me!.id)
                          .isPlaying
                      }
                      onClick={() => onClickAnswer(index)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="game-footer h-group">
          <button
            onClick={() => {
              Connection.instance.leaveGame();
            }}
          >
            Leave game
          </button>
          <div className="h-group center">
            <Hint
              mode={mode!} // Lobby or Game
              answerProvided={
                question?.hasOwnProperty('correctAnswer') || false
              } // Backend provided an answer
              selected={myAnswerIndex !== -1} // Has selected an answer
              correct={myAnswerIndex === question?.correctAnswer} // Selected answer is correct
              isHost={game.hostId === Connection.instance.me?.id} // Is host
            />
            {mode === GameMode.GAME && (
              <p className="score">
                {`${
                  players.find((p: any) => p.user.id === game.me!.id)?.points
                } points`}
              </p>
            )}
          </div>
          {game.hostId === Connection.instance.me?.id &&
            mode === GameMode.LOBBY && (
              <button
                onClick={() => {
                  Connection.instance.startGame();
                }}
              >
                Start Game
              </button>
            )}
        </div>
      </div>
      <div className="cursor-container">
        {document.querySelector('.cursor-container') &&
          players.map(
            (p: any, index: number) =>
              playerCoordinates[p.user.id] &&
              p.user.id !== game.me.id && (
                <div
                  key={index}
                  className="game-player-cursor"
                  style={{
                    left: playerCoordinates[p.user.id].x,
                    top:
                      playerCoordinates[p.user.id].y -
                      document
                        .querySelector('.cursor-container')!
                        .getBoundingClientRect().top
                  }}
                >
                  <img
                    className="game-avatar"
                    src={
                      'assets/' + getItemById(p.user.currentAvatar)?.value.url
                    }
                    alt=""
                  />

                  {/* <h2>{p.user.username}</h2> */}
                  {/* {playerCoordinates[p.user.id] && (
                    <pre>{JSON.stringify(playerCoordinates[p.user.id])}</pre>
                  )} */}
                </div>
              )
          )}
      </div>
    </div>
  );
}
