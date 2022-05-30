import React, { useEffect, useState } from 'react';
import {
  currentLanguage,
  initialLanguage,
  Language,
  setAppLanguage,
  text
} from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';

export function PopupSettings() {
  const [language, setLanguage] = useState(currentLanguage);

  useEffect(() => {
    setAppLanguage(language);
  }, [language]);

  return (
    <div className="modal">
      <div className="popup">
        <div className="popup-header">
          <span>{text('popupSettings_title')}</span>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          <p>{text('popupSettings_language_label')}</p>
          <div className="h-group center">
            <button
              className={
                language === Language.EN
                  ? 'btn-link btn-flag selected'
                  : 'btn-link btn-flag'
              }
              onClick={() => {
                setLanguage(Language.EN);
              }}
            >
              <img src="assets/icons/flags/en.png" alt="en" />
              English
            </button>
            <button
              className={
                language === Language.DE
                  ? 'btn-link btn-flag selected'
                  : 'btn-link btn-flag'
              }
              onClick={() => {
                setLanguage(Language.DE);
              }}
            >
              <img src="assets/icons/flags/de.png" alt="de" />
              Deutsch
            </button>
          </div>
          {initialLanguage !== language && (
            <div className="alert warn">
              <img src={'assets/avatars/system.png'} alt="" />

              {text(
                'popupSettings_language_warning',
                initialLanguage,
                language
              )}
            </div>
          )}
        </div>
        <div className="popup-taskbar">
          <button
            className="btn"
            onClick={() => {
              window.location.reload();
            }}
          >
            <i className="fas fa-redo" />
            {text('popupSettings_reload')}
          </button>
        </div>
      </div>
    </div>
  );
}
