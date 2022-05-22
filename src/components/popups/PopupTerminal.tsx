import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';
import TerminalComponent from '../TerminalComponent';

export class PopupTerminal extends React.Component<PopupProps> {
  render() {
    const { isOpen, onClose } = this.props;

    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Terminal</span>
            <button className="btn-link btn-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <TerminalComponent />
          </div>
        </div>
      </Modal>
    );
  }
}
