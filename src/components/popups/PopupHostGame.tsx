import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection from '../../connection/Connection';
import { gameCategoryNames } from '../../connection/Game';
import { rootElement } from '../../index';
import Checkbox from '../Checkbox';

type State = {
  gameName: string;
  gameDescription: string;
  gamePassword: string;
  gameCategories: { [key: string]: boolean };
  validationMessage: string | null;
};

interface PopupHostGameProps extends PopupProps {}

export class PopupHostGame extends React.Component<PopupHostGameProps> {
  public readonly state: State = {
    gameName: '',
    gameDescription: '',
    gamePassword: '',
    gameCategories: {},
    validationMessage: null
  };

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Host a Game</span>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            <div className="input-group">
              <p>Game Name</p>
              <input
                type="text"
                placeholder="My awesome game!"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    gameName: event.target.value
                  }));
                }}
              />
            </div>
            <div className="input-group">
              <p>Game Description</p>
              <input
                type="text"
                placeholder="Did you know that this game is awesome?"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    gameDescription: event.target.value
                  }));
                }}
              />
            </div>
            <div className="input-group">
              <p>Game Password</p>
              <input
                type="text"
                placeholder="Top secret password"
                onChange={(event) => {
                  this.setState((state, props) => ({
                    gamePassword: event.target.value
                  }));
                }}
              />
            </div>
            <div className="input-group">
              <p>Game Categories</p>
              <pre>{}</pre>
              <ul className="game-categories">
                {gameCategoryNames.map((category, index) => (
                  <li key={index}>
                    <Checkbox
                      text={category.name}
                      value={this.state.gameCategories[category.id.toString()]}
                      checked={(isChecked: boolean) => {
                        this.setState((state, props) => ({
                          gameCategories: {
                            ...this.state.gameCategories,
                            [category.id.toString()]: isChecked
                          }
                        }));
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {this.state.validationMessage && (
              <div className="alert error">
                {this.state.validationMessage}
                <button
                  className="button-close"
                  onClick={() => {
                    this.setState((state, props) => ({
                      validationMessage: null
                    }));
                  }}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            )}
          </div>

          <div className="popup-taskbar">
            <button
              onClick={() => {
                onClose!();
              }}
            >
              Cancel
            </button>
            <button onClick={this.validateAndHost.bind(this)}>Host Game</button>
          </div>
        </div>
      </Modal>
    );
  }

  validateAndHost() {
    const { onClose } = this.props;

    if (this.state.gameName === '') {
      this.setState((state, props) => ({
        validationMessage: 'Game name cannot be empty'
      }));
      return;
    }

    let categoryList: number[] = [];
    Object.keys(this.state.gameCategories).forEach((key: string) => {
      if (this.state.gameCategories[key]) {
        categoryList.push(parseInt(key));
      }
    });

    console.log('categories:', categoryList);
    Connection.instance.hostGame({
      name: this.state.gameName,
      description: this.state.gameDescription,
      password: this.state.gamePassword,
      categories: categoryList
    });

    onClose!();
  }
}
