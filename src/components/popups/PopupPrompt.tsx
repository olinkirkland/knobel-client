import React from 'react';
import PopupMediator from '../../controllers/popupMediator';

interface PopupPromptProps {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

export function PopupPrompt(props: PopupPromptProps) {
  const { title, message, onConfirm, onCancel, confirm, cancel, onClose } =
    props;

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
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="popup-content">
          <p>{message}</p>
        </div>
        <div className="popup-taskbar">
          <button
            className="btn"
            onClick={() => {
              onCancel!();
              close();
            }}
          >
            {cancel}
          </button>
          <button
            className="btn"
            onClick={() => {
              onConfirm!();
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
