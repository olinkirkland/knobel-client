import Modal from 'react-modal';
import React from 'react';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../../index';

export enum SectionType {
  TITLE = 'title',
  BODY = 'body',
  IMAGE = 'image'
}

interface PopupBookProps extends PopupProps {
  title: string;
  sections: { type: SectionType; data: string }[];
  okButton?: string;
}

export class PopupBook extends React.Component<PopupBookProps> {
  render() {
    const { isOpen, title, sections, okButton, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>{title}</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <ul className="popup-book">
              {sections.map((section, index) => (
                <li key={index}>
                  {section.type === SectionType.TITLE && (
                    <h2>{section.data}</h2>
                  )}
                  {section.type === SectionType.BODY && <p>{section.data}</p>}
                  {section.type === SectionType.IMAGE && (
                    <img src={section.data} alt="" />
                  )}
                </li>
              ))}
            </ul>
          </div>
          {okButton && (
            <div className="popup-taskbar">
              <button className="button-ok" onClick={onClose}>
                {okButton}
              </button>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
