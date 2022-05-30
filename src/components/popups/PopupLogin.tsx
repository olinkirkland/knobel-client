import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';

export function PopupLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  function validateAndLogin() {
    // Validation
    if (email.length === 0 || password.length === 0) {
      setValidationMessage('Please enter an email and password to login.');
      return;
    }

    // Login
    Connection.instance.login(email, password);
    PopupMediator.close();
  }

  return (
    <div className="modal">
      <div className="popup popup-login">
        <div className="popup-header">
          <span>Login</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <div className="input-group">
            <p>Email</p>
            <input
              type="text"
              placeholder="john.doe@email.com"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <p>Password</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  validateAndLogin();
                }
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
          <button className="btn-link">
            <span>Forgot password?</span>
          </button>
          <button className="btn" onClick={validateAndLogin}>
            <i className="fas fa-sign-in-alt" />
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
