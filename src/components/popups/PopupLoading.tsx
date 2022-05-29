import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

interface PopupLoadingProps extends PopupProps {
  isOpaque: boolean;
}

export class PopupLoading extends React.Component<PopupLoadingProps> {
  render() {
    const { isOpen, isOpaque } = this.props;
    return (
      <Modal
        isOpen={isOpen!}
        appElement={rootElement!}
        className={`modal ${isOpaque && 'opaque'}`}
      >
        <div className="popup popup-loading">
          <span>Loading</span>
        </div>
      </Modal>
    );
  }
}
