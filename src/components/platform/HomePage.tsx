import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../../controllers/connection';
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
            titleText="Join a Random Match"
            buttonText="Quick Play"
            image="assets/images/abstract-1.png"
          />
          <HomePanel
            onClick={() => {
              PopupMediator.open(PopupShop);
            }}
            titleText="Avatars &amp; Wallpapers"
            buttonText="Shop"
            image="assets/images/abstract-2.png"
          />
          <HomePanel
            onClick={() => {
              // PopupMediator.open(PopupHostGame);
            }}
            titleText="Host or Join a Custom Game"
            buttonText="Custom Game"
            image="assets/images/abstract-4.png"
          />
          {isRegistered && isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupMe);
              }}
              titleText="Customize My Profile"
              buttonText="My Profile"
              image="assets/images/abstract-5.png"
            />
          )}
          {isRegistered && !isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupInputVerifyCode);
              }}
              titleText="Get a FREE Gift!"
              buttonText="Verify Email"
              image="assets/images/verify-gift.png"
            />
          )}
          {!isRegistered && !isVerified && (
            <HomePanel
              onClick={() => {
                PopupMediator.open(PopupRegister);
              }}
              titleText="Register with an Email"
              buttonText="Sign Up"
              image="assets/images/abstract-5.png"
            />
          )}
        </div>
      </div>
    </div>
  );
}
