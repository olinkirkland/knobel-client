import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import { text } from '../../controllers/locale';
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
      setValidationMessage(text('popupPassword_validation_passwordLength'));
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage(text('popupPassword_validation_passwordMatch'));
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
          <span>{text('popupPassword_title')}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{text('popupPassword_label')}</p>

          <div className="input-group">
            <p>{text('currentPassword')}</p>
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
            {text('popupPassword_warn')}
          </div>

          <div className="input-group">
            <p>{text('popupPassword_newPassword')}</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <p>{text('popupPassword_confirmNewPassword')}</p>
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
            {text('popupPassword_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
