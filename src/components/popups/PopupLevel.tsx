import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupLevelUpProps extends PopupProps {
  level: number;
  gold: number;
}

export class PopupLevelUp extends React.Component<PopupLevelUpProps> {
  render() {
    const { isOpen, level, gold, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header popup-success">
            <span>🎉 Level Up!</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <p>Welcome to level {level}!</p>
            <p>
              You have received <span className='gold-text'>{gold}</span>
              <img className="icon" src="/assets/icons/coin.png" alt="" /> as a
              reward.
            </p>
          </div>
        </div>
      </Modal>
    );
  }
}
