import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { validateEmail, validatePassword } from '../../utils';

export function PopupRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  function validateAndRegister() {
    // Validation
    if (!validateEmail(email)) {
      setValidationMessage('Please enter a valid email.');
      return;
    }

    if (!validatePassword(password)) {
      setValidationMessage(
        'Please enter a valid password. Must be at least 8 characters long.'
      );
      return;
    }

    if (password !== passwordConfirm) {
      setValidationMessage('Passwords do not match.');
      return;
    }

    // Register
    Connection.instance.register(email, password);
    PopupMediator.close();
  }

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>Create Account</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>
            Enter a valid Email and password. You can change your username once
            your account is created.
          </p>

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
            />
          </div>
          <div className="input-group">
            <p>Confirm password</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  validateAndRegister();
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

          <div className="alert warn">
            <img src={'assets/avatars/system.png'} alt="" />
            <span>
              The progress from your current session will be saved to your new
              account.
            </span>
          </div>
        </div>
        <div className="popup-taskbar">
          <button className="btn" onClick={validateAndRegister}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
