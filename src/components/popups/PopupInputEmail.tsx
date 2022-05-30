import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { validateEmail } from '../../utils';

type State = {
  email: string;
  password: string;
  validationMessage: string | null;
};

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
          <span>Change Email</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>Enter your password and a new Email address.</p>

          <div className="input-group">
            <p>Current password</p>
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
            Make sure your Email is reachable. We don't send spam and we don't
            share your Email address with anybody.
          </div>

          <div className="input-group">
            <p>Your new Email</p>
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
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}
