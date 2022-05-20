import Modal from 'react-modal';
import React from 'react';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

type State = {
  input: string;
};

interface PopupInputProps extends PopupProps {
  title: string;
  message: string;
  placeholder: string;
  confirm: string;
  cancel: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}

export class PopupInput extends React.Component<PopupInputProps> {
  public readonly state: State = {
    input: ''
  };

  render() {
    const {
      isOpen,
      title,
      message,
      placeholder,
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
          </div>
          <div className="popup-content">
            <p>{message}</p>
            <input
              className="popup-input"
              type="text"
              placeholder={placeholder}
              onChange={(event) => {
                this.setState((state, props) => ({
                  input: event.target.value
                }));
              }}
            />
          </div>
          <div className="popup-taskbar">
            <button
              onClick={() => {
                onCancel!();
                onClose!();
              }}
            >
              {cancel}
            </button>
            <button
              onClick={() => {
                onConfirm!(this.state.input);
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
