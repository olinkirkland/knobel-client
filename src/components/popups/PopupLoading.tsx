import { text } from '../../controllers/locale';

export default function PopupLoading() {
  return (
    <div className={`modal`}>
      <div className="popup popup-loading">
        <span>{text('loading')}</span>
      </div>
    </div>
  );
}
