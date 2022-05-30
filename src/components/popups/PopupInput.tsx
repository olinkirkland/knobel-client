import React from 'react';
import PopupMediator from '../../controllers/popupMediator';

interface PopupInputProps {
  title: string;
  message: string;
  placeholder: string;
  confirm: string;
  cancel: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
  onClose?: () => void;
}

export function PopupInput(props: PopupInputProps) {
  const [input, setInput] = React.useState('');

  const {
    title,
    message,
    placeholder,
    onConfirm,
    onCancel,
    confirm,
    cancel,
    onClose
  } = props;

  function close() {
    PopupMediator.close();
    if (onClose) onClose();
  }

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>{title}</span>
          <button className="btn-link btn-close" onClick={close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{message}</p>
          <input
            className="popup-input"
            type="text"
            placeholder={placeholder}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </div>
        <div className="popup-taskbar">
          <button
            className="btn"
            onClick={() => {
              onCancel!();
              close!();
            }}
          >
            {cancel}
          </button>
          <button
            className="btn"
            onClick={() => {
              onConfirm!(input);
              close();
            }}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
