import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../connection/Connection';
import { rootElement } from '../../index';
import { validateEmail } from '../../Util';

type State = {
  email: string;
  password: string;
  validationMessage: string | null;
};

interface PopupInputEmailProps extends PopupProps {}

export class PopupInputEmail extends React.Component<PopupInputEmailProps> {
  public readonly state: State = {
    email: '',
    password: '',
    validationMessage: null
  };

  private validateAndChangePassword() {
    const { onClose } = this.props;

    // Validation
    if (!validateEmail(this.state.email)) {
      this.setState((state, props) => ({
        validationMessage: 'Please enter a valid email.'
      }));
      return;
    }

    // Submit
    Connection.instance.changeEmail(this.state.password, this.state.email);

    onClose!();
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Change Email</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <p>Enter your password and a new Email address.</p>

            <div className="input-group">
              <p>Current password</p>
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

            <div className="alert warn">
              <img src={'assets/avatars/system.png'} alt="" />
              Make sure your Email is reachable. We don't send spam mail, we
              promise!
            </div>

            <div className="input-group">
              <p>Your new Email</p>
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
              Change Email
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
