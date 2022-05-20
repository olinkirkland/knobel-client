import Connection from '../../connection/Connection';
import { numberComma } from '../../Util';

export default function PopoverGold() {
  const me = Connection.instance.me!;

  return (
    <div className="popover popover-gold">
      <img className="" src="assets/icons/coin.png" alt="" />
      <span className="gold-text">{numberComma(me.gold!)}</span>
      <p>
        Spend gold in the shop and get your hands on rare avatars, emotes, and
        wallpapers.
      </p>
    </div>
  );
}
