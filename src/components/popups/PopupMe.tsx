import React, { useEffect, useState } from 'react';
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
import { PopupLogin } from './PopupLogin';
import { PopupPrompt } from './PopupPrompt';
import { PopupRegister } from './PopupRegister';

export function PopupMe() {
  const [avatar, setAvatar] = useState(me.avatar);

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChange
    );

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.USER_DATA_CHANGED,
        onUserDataChange
      );
    };
  }, []);

  function onUserDataChange() {
    setAvatar(me.avatar!);
  }

  return (
    <div className="modal">
      <div className="popup popup-profile">
        <div className="popup-header">
          <span>My Profile</span>
          <button
            className="btn-link btn-close"
            onClick={() => {
              PopupMediator.close();
            }}
          >
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
                          className="btn selected"
                          onClick={() => {
                            PopupMediator.open(PopupInputVerifyCode);
                          }}
                        >
                          <i className="fas fa-envelope" />
                          Verify Email
                        </button>
                      </div>
                    </>
                  ))}
              </div>
            )}
            <div className="h-group center">
              <img
                className="avatar"
                src={'assets/' + getItemById(avatar!)?.value.url}
                alt=""
              />
            </div>
            {!me.isRegistered && <span className="badge guest">Guest</span>}
            {me.isRegistered && me.isVerified && (
              <span className="badge verified">
                <i className="fas fa-check" />
                Verified
              </span>
            )}
            <h1>{me.name}</h1>
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
                <div className="h-group center">
                  <button
                    className={`btn ${
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
                    className="btn"
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
            {
              <div className="h-group center show-mobile">
                {!me.isRegistered && (
                  <button
                    className="btn"
                    onClick={() => PopupMediator.open(PopupLogin)}
                  >
                    Login
                  </button>
                )}
                {!me.isRegistered && (
                  <button
                    className="btn"
                    onClick={() => PopupMediator.open(PopupRegister)}
                  >
                    Sign Up
                  </button>
                )}
                {me.isRegistered && (
                  <button
                    className="btn"
                    onClick={() =>
                      PopupMediator.open(PopupPrompt, {
                        title: 'Are you sure?',
                        message: 'This will log you out.',
                        confirm: 'Log Out',
                        cancel: 'Cancel',
                        onConfirm: () => {
                          Connection.instance.logout();
                        },
                        onCancel: () => {
                          PopupMediator.close();
                        }
                      })
                    }
                  >
                    Logout
                  </button>
                )}
              </div>
            }

            <div className="h-group">
              <button
                className="btn-link btn-id"
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
    </div>
  );
}
