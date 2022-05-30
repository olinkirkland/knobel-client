import React from 'react';
import PopupMediator from '../../controllers/popupMediator';
import TerminalComponent from '../TerminalComponent';

export function PopupTerminal() {
  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>Terminal</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <TerminalComponent />
        </div>
      </div>
    </div>
  );
}
