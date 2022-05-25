interface Props {
  percent: number;
}

export default function ProgressBar({ percent }: Props) {
  return (
    <div className="progress-bar">
      <div className="trough">
        <div className="thumb" style={{ width: `${percent * 100}%` }}></div>
      </div>
    </div>
  );
}
