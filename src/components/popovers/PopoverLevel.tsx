import Connection from '../../connection/Connection';
import { experienceNeededFromLevel } from '../../Util';
import ProgressBar from '../platform/ProgressBar';

export default function PopoverLevel() {
  const me = Connection.instance.me!;

  return (
    <div className="popover popover-level">
      <div className="level-badge">
        <span className="level">{me.level}</span>
        {/* <ProgressBar
          percent={Math.min(
            me.experience! / experienceNeededFromLevel(me.level!)
          )}
        /> */}
      </div>
      <span className='experience'>{`${me.experience}/${experienceNeededFromLevel(
        me.level!
      )} XP`}</span>
      <p>
        Earn experience and level up by playing games and completing challenges.
      </p>
    </div>
  );
}
