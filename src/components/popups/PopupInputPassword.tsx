import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { validatePassword } from '../../utils';

export function PopupInputPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  function validateAndChangePassword() {
    // Validation
    if (!validatePassword(password)) {
      setValidationMessage(
        'Please enter a valid password. Must be at least 8 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage('Passwords do not match.');
      return;
    }

    // Submit
    Connection.instance.editPassword(currentPassword, password);

    PopupMediator.close();
  }

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>Change Password</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>Enter your current password and your new password to change it.</p>

          <div className="input-group">
            <p>Current password</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setCurrentPassword(event.target.value);
              }}
            />
          </div>

          <div className="alert warn">
            <img src={'assets/avatars/system.png'} alt="" />
            Make sure your password has a good mix of upper and lowercase
            letters. Don't tell anyone your password!
          </div>

          <div className="input-group">
            <p>New password</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <p>Confirm new password</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  validateAndChangePassword();
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
          <button className="btn" onClick={validateAndChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
