import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../..';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import PopupMediator from '../../controllers/popupMediator';
import { getItemById } from '../../data/item';
import { me } from '../../data/user';
import {
  calculateExperienceNeededForNextLevel,
  countNameChanges
} from '../../utils';
import {
  AvatarItemCollection,
  WallpaperItemCollection
} from '../ItemCollection';
import ProgressBar from '../ProgressBar';
import { PopupInput } from './PopupInput';
import { PopupInputEmail } from './PopupInputEmail';
import { PopupInputPassword } from './PopupInputPassword';
import { PopupInputVerifyCode } from './PopupInputVerifyCode';

export class PopupMe extends React.Component<PopupProps> {
  public componentDidMount() {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );
  }

  public componentWillUnmount() {
    Connection.instance.removeListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );
  }

  onUserDataChanged() {
    this.forceUpdate();
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
              {(!me.isRegistered || !me.isVerified) && (
                <div className="profile-header v-group">
                  {(!me.isRegistered && (
                    <>
                      <div className="alert warn">
                        <img src={'assets/avatars/system.png'} alt="" />
                        <span>
                          You are currently signed into a guest account.
                          <br />
                          Sign up to save your progress and customize your
                          profile.
                        </span>
                      </div>
                    </>
                  )) ||
                    (!me.isVerified && (
                      <>
                        <div className="alert warn">
                          <img src={'assets/avatars/system.png'} alt="" />
                          <div className="v-group">
                            <span>
                              You've been sent an Email to verify your Email
                              address.
                              <br />
                              Once your Email is verified, you'll receive a
                              welcome gift.
                            </span>
                          </div>
                        </div>
                        <div className="v-group center">
                          <button
                            className="btn"
                            onClick={() => {
                              PopupMediator.open(PopupInputVerifyCode);
                            }}
                          >
                            <i className="fas fa-check" />
                            Verify
                          </button>
                        </div>
                      </>
                    ))}
                </div>
              )}
              <div className="h-group center">
                <img
                  className="avatar"
                  src={'assets/' + getItemById(me.avatar!)?.value.url}
                  alt=""
                />
              </div>
              <div className="user-with-badge">
                {!me.isRegistered && <span className="badge guest">Guest</span>}
                <h1>{me.name}</h1>
              </div>
              <span className="emphasized text-center h-group">
                <i className="fas fa-quote-left muted" />
                <span>{me.note}</span>
                <i className="fas fa-quote-right muted" />
              </span>
              <div className="h-group">
                <div className="level-group v-group center">
                  <span>{`Level ${me.level}`}</span>
                  <ProgressBar
                    percent={Math.min(
                      me.experience! /
                        calculateExperienceNeededForNextLevel(me.level!)
                    )}
                  />
                </div>
              </div>
              {me.isRegistered && (
                <div className="v-group profile-info">
                  <div className="h-group spread center">
                    <button
                      className={`btn-link ${
                        countNameChanges() === 0 ? 'disabled' : ''
                      }`}
                      onClick={() => {
                        PopupMediator.open(PopupInput, {
                          title: 'Change your name',
                          message: `Choose a new username for your profile. This name will appear to other players. You have ${countNameChanges()} name change${
                            countNameChanges() !== 1 ? 's' : ''
                          } remaining.`,
                          placeholder: me.name!,
                          confirm: `Change (${countNameChanges()})`,
                          cancel: 'Cancel',
                          onConfirm: (text: string) => {
                            Connection.instance.editName(text);
                          },
                          onCancel: () => {}
                        });
                      }}
                    >
                      <i className="fas fa-pen" />
                      Change name ({countNameChanges()}x)
                    </button>
                    <button
                      className="btn-link"
                      onClick={() => {
                        PopupMediator.open(PopupInput, {
                          title: 'Edit your status',
                          message: 'Enter a new status for your profile.',
                          placeholder: me.note!,
                          confirm: 'Change',
                          cancel: 'Cancel',
                          onConfirm: (text: string) => {
                            Connection.instance.editNote(text);
                          },
                          onCancel: () => {}
                        });
                      }}
                    >
                      <i className="fas fa-pen" />
                      Change status
                    </button>
                  </div>
                  <div className="panel v-group">
                    <div className=" profile-editable-item">
                      <span className="muted">Email</span>
                      <span>{me.email}</span>
                      <button
                        className="btn-link"
                        onClick={() => {
                          PopupMediator.open(PopupInputEmail);
                        }}
                      >
                        <i className="fas fa-pen" />
                      </button>
                    </div>
                    <div className="profile-editable-item">
                      <span className="muted">Password</span>
                      <span>********</span>
                      <button
                        className="btn-link"
                        onClick={() => {
                          PopupMediator.open(PopupInputPassword);
                        }}
                      >
                        <i className="fas fa-pen" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="profile-collections">
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
              </div>
            </div>
          </div>

          <div className="popup-taskbar">
            <div className="v-group center">
              <div className="h-group">
                <button
                  className="btn-link"
                  onClick={() => {
                    navigator.clipboard.writeText(me.id!);
                  }}
                >
                  {`Id: ${me.id}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
