import React, { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { text } from '../../controllers/locale';
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
  const [wallpaper, setWallpaper] = useState(me.wallpaper);

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
    setWallpaper(me.wallpaper!);
  }

  return (
    <div className="modal">
      <div className="popup popup-profile">
        <div className="popup-header">
          <span>{text('popupMe_title')}</span>
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
                      <span>{text('popupMe_warn_notRegistered')}</span>
                    </div>
                  </>
                )) ||
                  (!me.isVerified && (
                    <>
                      <div className="alert warn">
                        <img src={'assets/avatars/system.png'} alt="" />
                        <div className="v-group">
                          <span>{text('popupMe_warn_notVerified')}</span>
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
                          {text('verifyEmail')}
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
                {text('verified')}
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
                <span>
                  {text('level')} {me.level}
                </span>
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
                        title: text('popupChangeName_title'),
                        message: text(
                          'popupChangeName_message',
                          countNameChanges()
                        ),
                        placeholder: me.name!,
                        confirm: text(
                          'popupChangeName_confirm',
                          countNameChanges()
                        ),
                        cancel: text('cancel'),
                        onConfirm: (text: string) => {
                          Connection.instance.editName(text);
                        },
                        onCancel: () => {}
                      });
                    }}
                  >
                    <i className="fas fa-pen" />
                    {text('editName', countNameChanges())}
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      PopupMediator.open(PopupInput, {
                        title: text('popupEditStatus_title'),
                        message: text('popupEditStatus_message'),
                        placeholder: me.note!,
                        confirm: text('popupEditStatus_confirm'),
                        cancel: text('cancel'),
                        onConfirm: (text: string) => {
                          Connection.instance.editNote(text);
                        },
                        onCancel: () => {}
                      });
                    }}
                  >
                    <i className="fas fa-pen" />
                    {text('editStatus')}
                  </button>
                </div>
                <div className="panel v-group">
                  <div className=" profile-editable-item">
                    <span className="muted">{text('email')}</span>
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
                    <span className="muted">{text('password')}</span>
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
                title={text('avatars')}
                items={me.getItems().filter((item) => item.type === 'avatar')}
              />
              <WallpaperItemCollection
                title={text('wallpapers')}
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
                    onClick={() => {
                      PopupMediator.open(PopupPrompt, {
                        title: text('promptLogout_title'),
                        message: text('promptLogout_message'),
                        confirm: text('promptLogout_confirm'),
                        cancel: text('cancel'),
                        onConfirm: () => {
                          Connection.instance.logout();
                        },
                        onCancel: () => {
                          PopupMediator.close();
                        }
                      });
                    }}
                  >
                    {text('logOut')}
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
