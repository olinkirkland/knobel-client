import React from 'react';
import PopupMediator from '../../controllers/popupMediator';

interface PopupSuccessProps {
  title: string;
  message: string;
}

export function PopupSuccess(props: PopupSuccessProps) {
  const { title, message } = props;
  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header popup-success">
          <span>{title}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{message}</p>
        </div>
        <div className="popup-taskbar">
          <button className="btn" onClick={PopupMediator.close}>
            <span>OK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
