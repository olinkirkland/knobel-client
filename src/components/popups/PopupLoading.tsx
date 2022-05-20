import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupLoadingProps extends PopupProps {}

export class PopupLoading extends React.Component<PopupLoadingProps> {
  render() {
    const { isOpen } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-fit">
          <div className="popup-header popup-loading">
            <span>Loading ...</span>
          </div>
        </div>
      </Modal>
    );
  }
}
