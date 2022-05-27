import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../controllers/connection';
import { me } from '../../data/user';
import { rootElement } from '../../index';

type State = {
  code: string;
  showResendSent: boolean;
};

interface PopupInputVerifyCodeProps extends PopupProps {}

export class PopupInputVerifyCode extends React.Component<PopupInputVerifyCodeProps> {
  public readonly state: State = {
    code: '',
    showResendSent: false
  };

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Verify Email with Code</span>
            <button className="btn-link btn-close" onClick={onClose}>
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
                  this.setState((state, props) => ({
                    code: event.target.value
                  }));
                }}
              />
            </div>

            <div className="v-group center">
              <button
                className="btn-link"
                onClick={() => {
                  this.setState((state, props) => ({
                    showResendSent: true
                  }));
                  Connection.instance.resendVerificationEmail();
                }}
              >
                <i className="fas fa-envelope" />
                Resend the verification Email
              </button>
              {this.state.showResendSent && (
                <div className="alert success">
                  <span>A verification Email was sent to {me.email}.</span>
                  <button
                    className="btn-link btn-close"
                    onClick={() => {
                      this.setState((state, props) => ({
                        showResendSent: false
                      }));
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
                Connection.instance.verifyEmail(this.state.code);
              }}
            >
              Submit code
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
