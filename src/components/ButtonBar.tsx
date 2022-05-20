import { useEffect } from 'react';

// Expects multiple child button elements
type Props = {
  children: React.ReactNode;
};

export default function ButtonBar({ children }: Props) {
  useEffect(() => {
    // Select the first button
  }, []);

  function onButtonClicked(event: React.MouseEvent) {
    // Select the button
    const button = event.target as HTMLButtonElement;
    // Deselect other buttons
    const buttons = button.parentElement!.querySelectorAll('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('selected');
    }

    if (!button.classList.contains('selected'))
      button.classList.add('selected');
  }

  return (
    <div className="h-group" onClick={onButtonClicked}>
      {children}
    </div>
  );
}
