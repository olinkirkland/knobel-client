import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection, { url } from '../../connection/Connection';
import { rootElement } from '../../index';

type State = {
  games: any[] | null;
};

interface PopupJoinGameProps extends PopupProps {}

export class PopupJoinGame extends React.Component<PopupJoinGameProps> {
  public readonly state: State = {
    games: null
  };

  public componentDidMount() {
    this.refreshList();
  }

  private refreshList() {
    axios.get(url + 'game/list').then((res) => {
      const data = res.data;
      this.setState({ games: data });
    });
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup">
          <div className="popup-header">
            <span>Join a Game</span>
            <div className="h-group">
              <button
                className="button-close"
                onClick={() => this.refreshList()}
              >
                <i className="fas fa-sync"></i>
              </button>
              <button className="button-close" onClick={onClose}>
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="popup-content">
            {this.state.games?.length === 0 && (
              <div className="center h-group">
                <p className="muted">No open games. Host one instead.</p>
              </div>
            )}
            <ul className="game-list">
              {this.state.games?.map((game, index) => (
                <li
                  onClick={() => {
                    Connection.instance.joinGame(game.gameID);
                    onClose!();
                  }}
                  className="join-game-tile"
                  key={index}
                >
                  <div>
                    <p>{game.name}</p>
                    <h2>{game.host.username}</h2>
                  </div>
                  <span className="player-count">
                    <p className="muted">{game.playerCount}</p>
                    <i className="fas fa-user-friends muted" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    );
  }
}
