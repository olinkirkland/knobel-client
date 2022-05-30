import React from 'react';
import Connection from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';

export function PopupInputVerifyCode() {
  const [code, setCode] = React.useState('');
  const [showResendSent, setShowResendSent] = React.useState(false);

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>Verify Email with Code</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>Enter the code from the Email received at {me.email}.</p>

          <div className="input-group">
            <p>Verification Code</p>
            <input
              type="text"
              placeholder="A1B2C3"
              onChange={(event) => {
                setCode(event.target.value);
              }}
            />
          </div>

          <div className="v-group center">
            <button
              className="btn-link"
              onClick={() => {
                setShowResendSent(true);
                Connection.instance.resendVerificationEmail();
              }}
            >
              <i className="fas fa-envelope" />
              Resend the verification Email
            </button>
            {showResendSent && (
              <div className="alert success">
                <span>A verification Email was sent to {me.email}.</span>
                <button
                  className="btn-link btn-close"
                  onClick={() => {
                    setShowResendSent(false);
                  }}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            )}
          </div>
          <div className="alert warn">
            <img src={'assets/avatars/system.png'} alt="" />
            Need help? Email us at help@knobel.io
          </div>
        </div>
        <div className="popup-taskbar">
          <button
            className="btn"
            onClick={() => {
              Connection.instance.verifyEmail(code);
            }}
          >
            Submit code
          </button>
        </div>
      </div>
    </div>
  );
}
