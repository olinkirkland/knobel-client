import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import { text } from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';
import { validateEmail } from '../../utils';

export function PopupInputEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  function validateChangeEmail() {
    // Validation
    if (!validateEmail(email)) {
      setValidationMessage('Please enter a valid email.');
      return;
    }

    // Submit
    Connection.instance.editEmail(password, email);
    PopupMediator.close();
  }

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>{text('popupEmail_title')}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{text('popupEmail_label')}</p>

          <div className="input-group">
            <p>{text('currentPassword')}</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>

          <div className="alert warn">
            <img src={'assets/avatars/system.png'} alt="" />
            {text('popupEmail_warn')}
          </div>

          <div className="input-group">
            <p>{text('popupEmail_newEmail')}</p>
            <input
              type="text"
              placeholder="john.doe@email.com"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>

          {validationMessage && (
            <div className="alert error">
              {validationMessage}
              <button
                className="btn-link btn-close"
                onClick={() => {
                  setValidationMessage(null);
                }}
              >
                <i className="fas fa-times" />
              </button>
            </div>
          )}
        </div>
        <div className="popup-taskbar">
          <button className="btn" onClick={validateChangeEmail}>
            {text('popupEmail_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
