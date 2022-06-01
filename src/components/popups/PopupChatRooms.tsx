import React, { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { text } from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';
import Chat from '../../data/chat';
import ChatMessage from '../ChatMessage';

export function PopupChatRooms() {
  const [chats, setChatMessages] = useState<Chat[]>(Connection.instance.chats);

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.CHAT_MESSAGE,
      onChatMessageReceived
    );

      scrollToBottom();

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.CHAT_MESSAGE,
        onChatMessageReceived
      );
    };
  }, []);

  function onChatMessageReceived() {
    setChatMessages([...Connection.instance.chats]);
    scrollToBottom();
  }

  useEffect(() => {}, []);

  function scrollToBottom() {
    // Scroll to bottom
    const chatContainer = document.querySelector('.chat-messages')!;
    if (!chatContainer) return;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }

  function sendChatMessage() {
    const input: HTMLInputElement = document.querySelector('.chat-input')!;
    const msg = input.value;
    input.value = '';
    if (!msg || msg.trim().length === 0) {
      return;
    }
    Connection.instance.sendChatMessage(msg);
    input.focus();
  }

  return (
    <div className="modal">
      <div className="popup popup-chat">
        <div className="popup-header">
          <span>{text('chat')}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <ul className="chat-messages">
            {chats.map((chat, index) => (
              <ChatMessage
                key={index}
                data={chat}
                isBlock={
                  index > 0 ? chat.user.id === chats[index - 1].user.id : false
                }
              />
            ))}
          </ul>
          <div className="chat-input-container">
            <input
              className="chat-input"
              type="text"
              placeholder="Type a message..."
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendChatMessage();
              }}
            />
            <button className="btn-link" onClick={sendChatMessage}>
              <i className="fas fa-paper-plane"></i>
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
