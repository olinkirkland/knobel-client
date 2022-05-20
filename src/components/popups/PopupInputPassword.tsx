import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../connection/Connection';
import { rootElement } from '../../index';
import { validatePassword } from '../../Util';

type State = {
  currentPassword: '';
  password: string;
  confirmPassword: string;
  validationMessage: string | null;
};

interface PopupInputPasswordProps extends PopupProps {}

export class PopupInputPassword extends React.Component<PopupInputPasswordProps> {
  public readonly state: State = {
    currentPassword: '',
    password: '',
    confirmPassword: '',
    validationMessage: null
  };

  private validateAndChangePassword() {
    const { onClose } = this.props;

    // Validation
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

    // Submit
    Connection.instance.changePassword(
      this.state.currentPassword,
      this.state.password
    );

    onClose!();
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Change Password</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <p>
              Enter your current password and your new password to change it.
            </p>

            <div className="input-group">
              <p>Current password</p>
              <input
                type="password"
                placeholder="********"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    currentPassword: event.target.value
                  }));
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
                  this.setState((state, props) => ({
                    password: event.target.value
                  }));
                }}
              />
            </div>
            <div className="input-group">
              <p>Confirm new password</p>
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
                    this.validateAndChangePassword();
                  }
                }}
              />
            </div>

            {this.state.validationMessage && (
              <div className="alert error">
                {this.state.validationMessage}
                <button
                  className="button-close"
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
            <button onClick={this.validateAndChangePassword.bind(this)}>
              Change Password
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
