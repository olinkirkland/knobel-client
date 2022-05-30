import React from 'react';
import PopupMediator from '../../controllers/popupMediator';

interface PopupErrorProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function PopupError(props: PopupErrorProps) {
  const { title, message, onClose } = props;

  function close() {
    PopupMediator.close();
    if (onClose) onClose();
  }

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header popup-error">
          <span>{title}</span>
          <button className="btn-link btn-close" onClick={close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{message}</p>
        </div>
        <div className="popup-taskbar">
          <button className="btn" onClick={close}>
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
