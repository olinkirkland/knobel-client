import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../connection/Connection';
import PopoverMediator, {
  PopoverType
} from '../../controllers/PopoverMediator';
import Chat from '../../models/Chat';
import ChatMessage from './ChatMessage';

export default function PopoverChat() {
  const [chatMessages, setChatMessages] = useState<Chat[]>([
    ...Connection.instance.chatMessages
  ]);

  const [onlineUsers, setOnlineUsers] = useState(
    Connection.instance.onlineUsers
  );

  useEffect(() => {
    const connection = Connection.instance;
    scrollToBottom();
    connection.addListener(ConnectionEventType.CHAT_MESSAGE, onReceiveMessage);
    connection.addListener(
      ConnectionEventType.ONLINE_USERS,
      onOnlineUsersChanged
    );

    const input: HTMLInputElement = document.querySelector('.chat-input')!;
    input.focus();

    return () => {
      connection.removeListener(
        ConnectionEventType.CHAT_MESSAGE,
        onReceiveMessage
      );
      connection.removeListener(
        ConnectionEventType.ONLINE_USERS,
        onOnlineUsersChanged
      );
    };
  }, []);

  function onReceiveMessage(chatMessage: Chat) {
    setChatMessages((value) => [...value, chatMessage]);
    scrollToBottom();
  }

  function onOnlineUsersChanged(count: number) {
    setOnlineUsers(count);
  }

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
    Connection.instance.chat(msg);
    input.focus();
  }

  return (
    <div className="popover popover-chat">
      <span className="chat-header">
        <div className="h-group">
          <span>{`Chat Room (${onlineUsers} here now)`}</span>
        </div>
        <button
          className="button-close"
          onClick={() => {
            PopoverMediator.close(PopoverType.CHAT);
          }}
        >
          <i className="fas fa-times" />
        </button>
      </span>
      <ul className="chat-messages">
        {chatMessages.map((chatMessage, index) => (
          <ChatMessage
            key={index}
            data={chatMessage}
            isBlock={
              index > 0
                ? chatMessage.user.id === chatMessages[index - 1].user.id
                : false
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
        <button className="link" onClick={sendChatMessage}>
          <i className="fas fa-paper-plane"></i>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
