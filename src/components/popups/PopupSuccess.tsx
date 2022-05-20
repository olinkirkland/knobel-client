import Modal from 'react-modal';
import React from 'react';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupSuccessProps extends PopupProps {
  title: string;
  message: string;
}

export class PopupSuccess extends React.Component<PopupSuccessProps> {
  render() {
    const { isOpen, title, message, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header popup-success">
            <span>{title}</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <p>{message}</p>
          </div>
        </div>
      </Modal>
    );
  }
}
