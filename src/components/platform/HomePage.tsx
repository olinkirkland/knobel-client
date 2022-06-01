import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
import { text } from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';
import { me } from '../../data/user';
import { PopupInputVerifyCode } from '../popups/PopupInputVerifyCode';
import { PopupMe } from '../popups/PopupMe';
import { PopupRegister } from '../popups/PopupRegister';
import { PopupShop } from '../popups/PopupShop';
import HomePanel from './HomePanel';

export default function HomePage() {
  const [isRegistered, setIsRegistered] = useState(me.isRegistered);
  const [isVerified, setIsVerified] = useState(me.isVerified);

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChanged
    );

    return () => {
      Connection.instance.removeListener(
        ConnectionEventType.USER_DATA_CHANGED,
        onUserDataChanged
      );
    };
  }, []);

  function onUserDataChanged() {
    setIsRegistered(me.isRegistered);
    setIsVerified(me.isVerified);
  }

  return (
    <div className="page home">
      <div className="home-container">
        <div className="home-grid">
          <HomePanel
            onClick={() => {
              // Connection.instance.joinRandomGame();
            }}
            titleText={text('homeTile_quickPlay_title')}
            buttonText={text('homeTile_quickPlay_cta')}
            image="assets/images/abstract-1.png"
          />
          <HomePanel
            onClick={() => {
              PopupMediator.open(PopupShop);
            }}
            titleText={text('homeTile_shop_title')}
            buttonText={text('homeTile_shop_cta')}
            image="assets/images/abstract-2.png"
          />
          <HomePanel
            onClick={() => {
              // PopupMediator.open(PopupHostGame);
            }}
            titleText={text('homeTile_customGame_title')}
            buttonText={text('homeTile_customGame_cta')}
            image="assets/images/abstract-4.png"
          />
          {isRegistered && isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupMe);
              }}
              titleText={text('homeTile_profile_title')}
              buttonText={text('homeTile_profile_cta')}
              image="assets/images/abstract-5.png"
            />
          )}
          {isRegistered && !isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupInputVerifyCode);
              }}
              titleText={text('homeTile_verifyEmail_title')}
              buttonText={text('homeTile_verifyEmail_cta')}
              image="assets/images/verify-gift.png"
            />
          )}
          {!isRegistered && !isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupRegister);
              }}
              titleText={text('homeTile_register_title')}
              buttonText={text('homeTile_register_cta')}
              image="assets/images/abstract-5.png"
            />
          )}
        </div>
      </div>
    </div>
  );
}
