import PopupMediator from '../controllers/popupMediator';
import Chat from '../data/chat';
import { getItemById } from '../data/item';
import { me } from '../data/user';
import { extractUrlsFromString, linkFromString } from '../utils';
import { PopupMe } from './popups/PopupMe';
import { PopupPrompt } from './popups/PopupPrompt';

export default function ChatMessage({
  data,
  isBlock = false
}: {
  data: Chat;
  isBlock: boolean;
}) {
  const { user, message, time } = data;

  const messageParts = extractUrlsFromString(message);

  if (!me) return <></>;
  return (
    <div
      className={`chat-message ${
        user.id === me.id ? 'chat-message-self' : ''
      } ${isBlock ? 'is-block' : ''}`}
    >
      {!isBlock && (
        <div className="chat-card">
          <img src={'assets/' + getItemById(user.avatar!)?.value.url} alt="" />
          {!user.isRegistered && <span className="badge guest">Guest</span>}
          <div className="h-group">
            {user.id === 'system' && <span className="muted">{user.name}</span>}
            {user.id !== 'system' && (
              <button
                className="btn-link"
                onClick={() => {
                  if (user.id === me.id) {
                    PopupMediator.open(PopupMe);
                  }
                }}
              >
                {user.name}
              </button>
            )}
            <span className="muted"> ᛫ </span>
            <span className="muted">{new Date(time).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
      <p className={`chat-text ${isBlock ? 'is-block' : ''}`}>
        {messageParts.map((part, index) => {
          if (part.isUrl)
            return (
              <button
                className="chat-link"
                key={index}
                onClick={() => {
                  PopupMediator.open(PopupPrompt, {
                    title: 'External link',
                    message: `Following the external link "${part.text}" will open a website in a new tab. Are you sure you want to continue?`,
                    onConfirm: () => {
                      window.open(linkFromString(part.text), '_blank');
                    },
                    onCancel: () => {},
                    confirm: 'Continue',
                    cancel: 'Cancel'
                  });
                }}
              >
                {part.text}
              </button>
            );
          else return part.text;
        })}
      </p>
    </div>
  );
}
