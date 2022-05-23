import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../..';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { getItemById } from '../../data/item';
import { me, Me } from '../../data/user';

type State = {
  user: Me | null;
};

export class PopupMe extends React.Component<PopupProps> {
  public readonly state: State = {
    user: null
  };

  private onUserDataChanged() {
    this.setState({
      user: me
    });
  }

  public componentDidMount() {
    this.onUserDataChanged();

    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );
  }

  public componentWillUnmount() {
    Connection.instance.removeListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-profile">
          <div className="popup-header">
            <span>My Profile</span>
            <button className="btn-link btn-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <div className="profile-data v-group center">
              {me.isRegistered && (
                <>
                  <div className="alert warn">
                    <img src={'assets/avatars/system.png'} alt="" />
                    <span>
                      You are currently signed into a guest account.
                      <br />
                      Sign up to save your progress and customize your profile.
                    </span>
                  </div>
                </>
              )}

              <pre>{JSON.stringify(this.state.user)}</pre>

              <div className="panel v-group">
                <div className=" profile-editable-item">
                  <span className="muted">Email</span>
                  <span>{this.state.user?.email}</span>
                  <button className="btn-link">
                    <i className="fas fa-pen" />
                  </button>
                </div>
                <div className="profile-editable-item">
                  <span className="muted">Password</span>
                  <span>********</span>
                  <button className="btn-link">
                    <i className="fas fa-pen" />
                  </button>
                </div>
              </div>

              <div className="user-with-badge">
                {!me.isRegistered && <span className="badge guest">Guest</span>}
                <h1>{this.state.user?.name}</h1>
              </div>

              <button
                className="btn"
                onClick={() => {
                  Connection.instance.fetchMyUserData();
                }}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
