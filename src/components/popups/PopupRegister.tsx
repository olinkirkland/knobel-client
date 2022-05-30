import React, { useState } from 'react';
import Connection from '../../controllers/connection';
import { text } from '../../controllers/locale';
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
      setValidationMessage(text('popupRegister_validation_passwordLength'));
      return;
    }

    if (password !== passwordConfirm) {
      setValidationMessage(text('popupRegister_validation_passwordMatch'));
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
          <span>{text('popupRegister_title')}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{text('popupRegister_label')}</p>

          <div className="input-group">
            <p>{text('email')}</p>
            <input
              type="text"
              placeholder="john.doe@email.com"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <p>{text('password')}</p>
            <input
              type="password"
              placeholder="********"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <p>{text('popupRegister_confirmPassword')}</p>
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
            <span>{text('popupRegister_warn')}</span>
          </div>
        </div>
        <div className="popup-taskbar">
          <button className="btn" onClick={validateAndRegister}>
            {text('popupRegister_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
