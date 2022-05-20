import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection, {
  ConnectionEventType,
  url
} from '../../connection/Connection';
import PopupMediator from '../../controllers/PopupMediator';
import Terminal from '../../controllers/Terminal';
import { rootElement } from '../../index';
import { getItemById } from '../../models/Item';
import User from '../../models/User';
import { experienceNeededFromLevel } from '../../Util';
import {
  AvatarItemCollection,
  WallpaperItemCollection
} from '../ItemCollection';
import ProgressBar from '../platform/ProgressBar';
import { PopupBook } from './PopupBook';
import { PopupInput } from './PopupInput';
import { PopupInputEmail } from './PopupInputEmail';
import { PopupInputPassword } from './PopupInputPassword';
import { cookie, impressum } from './PopupPresets';

interface PopupProfileProps extends PopupProps {
  id?: string;
}

type State = {
  user: User | null;
};

export class PopupProfile extends React.Component<PopupProfileProps> {
  public readonly state: State = {
    user: null
  };

  private userId?: string;

  constructor(props: PopupProfileProps) {
    super(props);
    this.userId = props.id;
  }

  private onUserDataChanged() {
    const connection = Connection.instance;
    if (this.userId === connection.me?.id) {
      this.setState({
        user: connection.me
      });
    }
  }

  private editUsername() {
    const me = Connection.instance.me!;
    PopupMediator.open(PopupInput, {
      title: 'Edit your username',
      message: `Choose a new username for your profile.`,
      placeholder: me.username!,
      confirm: 'Change',
      cancel: 'Cancel',
      onConfirm: (text: string) => {
        Connection.instance.changeUsername(text);
      },
      onCancel: () => {}
    });
  }

  private editStatus() {
    const me = Connection.instance.me!;
    PopupMediator.open(PopupInput, {
      title: 'Edit your status',
      message: 'Enter a new status for your profile.',
      placeholder: me.status!,
      confirm: 'Change',
      cancel: 'Cancel',
      onConfirm: (text: string) => {
        Connection.instance.changeStatus(text);
      },
      onCancel: () => {}
    });
  }

  private editEmail() {
    PopupMediator.open(PopupInputEmail);
  }

  private editPassword() {
    PopupMediator.open(PopupInputPassword);
  }

  public componentDidMount() {
    if (!this.userId) this.userId = Connection.instance.me?.id;

    axios
      .get(`${url}users/${this.userId}`, { withCredentials: true })
      .then((res) => {
        // Set state user
        this.setState({
          user: res.data
        });
      })
      .catch((err) => {
        Terminal.log('⚠️', err);
      });

    const connection = Connection.instance;
    connection.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );
  }

  public componentWillUnmount() {
    // const connection = Connection.instance;
    // connection.removeListener(
    //   ConnectionEventType.USER_DATA_CHANGED,
    //   this.onUserDataChanged
    // );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const me = Connection.instance.me!;
    if (!me) return <></>;
    const isMe = this.userId === me.id;

    if (!this.state.user) return <></>;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-profile">
          <div className="popup-header">
            <span>
              {isMe ? 'My Profile' : `${this.state.user.username}'s Profile`}
            </span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <div className="profile-data v-group center">
              {isMe && me.isGuest && (
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

              <div className="h-group center">
                <img
                  className="avatar"
                  src={
                    'assets/' +
                    getItemById(this.state.user.currentAvatar!)?.value.url
                  }
                  alt=""
                />
              </div>
              <div className="user-with-badge">
                {me.isGuest && <span className="badge guest">Guest</span>}
                <h1>{this.state.user.username}</h1>
              </div>

              <span className="emphasized text-center h-group">
                <i className="fas fa-quote-left muted" />
                <span>{this.state.user.status}</span>
                <i className="fas fa-quote-right muted" />
              </span>

              {isMe && !me.isGuest && (
                <div className="h-group center">
                  <button className="link" onClick={this.editUsername}>
                    <i className="fas fa-pen" onClick={this.editEmail} />
                    Edit username
                  </button>
                  <button className="link" onClick={this.editStatus}>
                    <i className="fas fa-pen" />
                    Edit status
                  </button>
                </div>
              )}

              <div className="level-group v-group center">
                <span>{`Level ${this.state.user.level}`}</span>
                {isMe && (
                  <ProgressBar
                    percent={Math.min(
                      me.experience! / experienceNeededFromLevel(me.level!)
                    )}
                  />
                )}
              </div>

              {isMe && !me.isGuest && (
                <div className="panel v-group">
                  <div className="profile-editable-item">
                    <span className="muted">Email</span>
                    <span>{me.email}</span>
                    <button className="link" onClick={this.editEmail}>
                      <i className="fas fa-pen" />
                    </button>
                  </div>
                  <div className="profile-editable-item">
                    <span className="muted">Password</span>
                    <span>********</span>
                    <button className="link" onClick={this.editPassword}>
                      <i className="fas fa-pen" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isMe && (
              <>
                <AvatarItemCollection
                  title="Avatars"
                  items={me.getItems().filter((item) => item.type === 'avatar')}
                />
                <WallpaperItemCollection
                  title="Wallpapers"
                  items={me
                    .getItems()
                    .filter((item) => item.type === 'wallpaper')}
                />
              </>
            )}
          </div>

          {isMe && (
            <div className="popup-taskbar">
              <div className="v-group center">
                <div className="h-group center">
                  <button
                    onClick={() => {
                      PopupMediator.open(PopupBook, cookie);
                    }}
                    className="link"
                  >
                    Cookie Policy
                  </button>
                  <button
                    onClick={() => {
                      PopupMediator.open(PopupBook, impressum);
                    }}
                    className="link"
                  >
                    Impressum
                  </button>
                </div>
                <div className="h-group">
                  <button
                    className="link"
                    onClick={() => {
                      navigator.clipboard.writeText(me.id!);
                    }}
                  >
                    {`Id: ${me.id}`}
                  </button>
                </div>
              </div>
            </div>
          )}
          {!isMe && (
            <div className="popup-taskbar">
              {!this.state.user?.isGuest && (
                <button>
                  <i className="fas fa-user-plus" />
                  <span>Add friend</span>
                </button>
              )}
              <button>
                <i className="fas fa-flag" />
                <span>Report</span>
              </button>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
