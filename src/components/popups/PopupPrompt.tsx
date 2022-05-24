import Modal from 'react-modal';
import React from 'react';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupPromptProps extends PopupProps {
  title: string;
  message: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export class PopupPrompt extends React.Component<PopupPromptProps> {
  render() {
    const {
      isOpen,
      title,
      message,
      onConfirm,
      onCancel,
      confirm,
      cancel,
      onClose
    } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>{title}</span>
            <button className="btn-link btn-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="popup-content">
            <p>{message}</p>
          </div>
          <div className="popup-taskbar">
            <button
              className="btn"
              onClick={() => {
                onCancel!();
                onClose!();
              }}
            >
              {cancel}
            </button>
            <button
              className="btn"
              onClick={() => {
                onConfirm!();
                onClose!();
              }}
            >
              {confirm}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
