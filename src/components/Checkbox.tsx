import { useEffect, useState } from 'react';

type Props = {
  text?: String;
  value: boolean;
  capitalize?: boolean;
  checked: Function;
  untranslated?: boolean;
};

export default function Checkbox({
  text,
  value = false,
  checked,
  capitalize = false,
  untranslated = false
}: Props) {
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    checked(isChecked);
  }, [isChecked]);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  function onToggle(event: React.MouseEvent) {
    setIsChecked((prev: Boolean) => !prev);
  }

  return (
    <div className="checkbox" onClick={onToggle}>
      <span className={`icon-frame ${isChecked && 'checked'}`}>
        {isChecked && <i className="fas fa-check"></i>}
      </span>
      <p>{text}</p>
    </div>
  );
}
