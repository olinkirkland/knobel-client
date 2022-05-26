import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../..';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { getItemById } from '../../data/item';
import { me, Me } from '../../data/user';
import { calculateExperienceNeededForNextLevel } from '../../utils';
import {
  AvatarItemCollection,
  WallpaperItemCollection
} from '../ItemCollection';
import ProgressBar from '../ProgressBar';

export class PopupMe extends React.Component<PopupProps> {
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
              {!me.isRegistered && (
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
              <div className="level-group v-group center">
                <span>{`Level ${me.level}`}</span>
                <ProgressBar
                  percent={Math.min(
                    me.experience! /
                      calculateExperienceNeededForNextLevel(me.level!)
                  )}
                />
              </div>
              {me.isRegistered && (
                <div className="panel v-group">
                  <div className=" profile-editable-item">
                    <span className="muted">Email</span>
                    <span>{me.email}</span>
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
