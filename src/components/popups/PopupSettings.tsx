import Modal from 'react-modal';
import React from 'react';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupSettingsProps extends PopupProps {}

export class PopupSettings extends React.Component<PopupSettingsProps> {
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Settings</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. At
            consectetur veritatis asperiores molestias nemo. Aperiam ullam
            voluptates earum voluptatem ipsa!
          </div>
        </div>
      </Modal>
    );
  }
}
