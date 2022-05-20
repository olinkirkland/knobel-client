import { useEffect, useState } from 'react';
import { GameMode } from '../../connection/Game';

interface Props {
  mode: GameMode;
  answerProvided: boolean;
  selected: boolean;
  correct: boolean;
  isHost: boolean;
}

const areYouSureMessages = [
  `Are you sure that's right?`,
  `I mean, if you think so.`,
  `Let's see how it pans out.`,
  `That looks like it could be a good answer!`,
  `I have a good feeling about your answer.`
];

const correctMessages = [
  `That's right!`,
  `I knew you had it in you!`,
  `You're a smart one, aren't you?`,
  `Great job!`,
  `Genius!`
];

const incorrectMessages = [
  `That's not right.`,
  `I'm sorry, but that's not right.`,
  `Better luck next time.`,
  `You can't know everything.`,
  `Honestly, I'm disappointed.`
];

const tooSlowMessages = [
  `Too slow!`,
  `Try to be faster next time.`,
  `You didn't choose an answer.`
];

export default function Hint({
  selected,
  answerProvided,
  mode,
  correct,
  isHost
}: Props) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selected)
      setMessage(
        areYouSureMessages[
          Math.floor(Math.random() * areYouSureMessages.length)
        ]
      );

    if (answerProvided) {
      if (correct) {
        setMessage(
          '✔️ ' +
            correctMessages[Math.floor(Math.random() * correctMessages.length)]
        );
      } else if (selected) {
        setMessage(
          '❌ ' +
            incorrectMessages[
              Math.floor(Math.random() * incorrectMessages.length)
            ]
        );
      } else {
        setMessage(
          '❌ ' +
            tooSlowMessages[Math.floor(Math.random() * tooSlowMessages.length)]
        );
      }
    } else setMessage('Choose an answer. Guess if you have to!');

    if (mode === GameMode.LOBBY)
      if (isHost) setMessage('Start the game when you are ready.');
      else setMessage('Waiting for the host to start the game.');

    return () => {};
  }, [mode, selected, correct, answerProvided, isHost]);

  return (
    <p
      className={`hint ${
        mode === GameMode.GAME && answerProvided && correct ? 'correct' : ''
      }
      ${
        mode === GameMode.GAME && answerProvided && !correct ? 'incorrect' : ''
      }`}
    >
      {message}
    </p>
  );
}
