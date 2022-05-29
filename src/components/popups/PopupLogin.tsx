import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../controllers/connection';
import { rootElement } from '../../index';

type State = {
  email: string;
  password: string;
  validationMessage: string | null;
};

interface PopupLoginProps extends PopupProps {}

export class PopupLogin extends React.Component<PopupLoginProps> {
  public readonly state: State = {
    email: '',
    password: '',
    validationMessage: null
  };

  private validateAndLogin() {
    const { onClose } = this.props;

    // Validation
    if (this.state.email.length === 0 || this.state.password.length === 0) {
      this.setState((state, props) => ({
        validationMessage: 'Please enter an email and password to login.'
      }));
      return;
    }

    // Login
    Connection.instance.login(this.state.email, this.state.password);
    onClose!();
  }

  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-login">
          <div className="popup-header">
            <span>Login</span>
            <button className="btn-link btn-close" onClick={onClose}>
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
                  this.setState((state, props) => ({
                    email: event.target.value
                  }));
                }}
              />
            </div>
            <div className="input-group">
              <p>Password</p>
              <input
                type="password"
                placeholder="********"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    password: event.target.value
                  }));
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    this.validateAndLogin();
                  }
                }}
              />
            </div>
            {this.state.validationMessage && (
              <div className="alert error">
                {this.state.validationMessage}
                <button
                  className="btn-link btn-close"
                  onClick={() => {
                    this.setState((state, props) => ({
                      validationMessage: null
                    }));
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
            <button className="btn" onClick={this.validateAndLogin.bind(this)}>
              <i className="fas fa-sign-in-alt" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
