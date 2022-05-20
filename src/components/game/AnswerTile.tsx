interface Props {
  text: string;
  selected: boolean;
  correct: boolean;
  incorrect: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function AnswerTile({
  text,
  selected,
  correct,
  incorrect,
  disabled,
  onClick
}: Props) {
  return (
    <div
      className={`answer-tile ${selected ? 'selected' : ''} ${
        correct ? 'correct' : ''
      } ${incorrect ? 'incorrect' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => (!disabled ? onClick() : null)}
    >
      <p>{text}</p>
    </div>
  );
}
