import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../controllers/connection';
import { me } from '../../data/user';
import { rootElement } from '../../index';
import { validateEmail, validatePassword } from '../../utils';

type State = {
  email: string;
  password: string;
  confirmPassword: string;
  validationMessage: string | null;
};

interface PopupRegisterProps extends PopupProps {}

export class PopupRegister extends React.Component<PopupRegisterProps> {
  public readonly state: State = {
    email: '',
    password: '',
    confirmPassword: '',
    validationMessage: null
  };

  private async validateAndRegister() {
    const { onClose } = this.props;

    // Validation
    if (!validateEmail(this.state.email)) {
      this.setState((state, props) => ({
        validationMessage: 'Please enter a valid email.'
      }));
      return;
    }

    if (!validatePassword(this.state.password)) {
      this.setState((state, props) => ({
        validationMessage:
          'Please enter a valid password. Must be at least 8 characters long.'
      }));
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState((state, props) => ({
        validationMessage: 'Passwords do not match.'
      }));
      return;
    }

    // Register
    await Connection.instance.register(this.state.email, this.state.password);
    onClose!();
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Create Account</span>
            <button className="btn-link btn-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <p>
              Enter a valid Email and password. You can change your username
              once your account is created.
            </p>

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
              />
            </div>
            <div className="input-group">
              <p>Confirm password</p>
              <input
                type="password"
                placeholder="********"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    confirmPassword: event.target.value
                  }));
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    this.validateAndRegister();
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

            <div className="alert warn">
              <img src={'assets/avatars/system.png'} alt="" />
              <span>
                The progress from your current session will be saved to your new
                account.
              </span>
            </div>
          </div>
          <div className="popup-taskbar">
            <button
              className="btn"
              onClick={this.validateAndRegister.bind(this)}
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
