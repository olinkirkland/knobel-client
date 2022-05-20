import Connection from '../connection/Connection';
import Item, { getItemById } from '../models/Item';

type Props = {
  title: string;
  items: Item[];
};

export function AvatarItemCollection({ title, items }: Props) {
  return (
    <div className="item-collection">
      <h2>{`${title} (${items.length})`}</h2>
      <ul>
        {items.map((item) => (
          <li
            onClick={() => {
              Connection.instance.changeAvatar(item.id);
            }}
            key={item.id}
            className={
              Connection.instance.me?.currentAvatar === item.id
                ? 'avatar-item selected'
                : 'avatar-item'
            }
          >
            <img src={`assets/${item.value.url}`} alt="" />
          </li>
        ))}
      </ul>

      <div className="item-definition">
        <h2>{getItemById(Connection.instance.me!.currentAvatar!)?.name}</h2>
        <p className="muted">
          {getItemById(Connection.instance.me!.currentAvatar!)?.description}
        </p>
      </div>
    </div>
  );
}

export function WallpaperItemCollection({ title, items }: Props) {
  return (
    <div className="item-collection">
      <h2>{`${title} (${items.length})`}</h2>
      <ul>
        {items.map((item) => (
          <li
            onClick={() => {
              Connection.instance.changeWallpaper(item.id);
            }}
            key={item.id}
            className={
              Connection.instance.me?.currentWallpaper === item.id
                ? 'wallpaper-item selected'
                : 'wallpaper-item'
            }
          >
            <img src={`assets/${item.value.url}`} alt="" />
          </li>
        ))}
      </ul>
      <div className="item-definition">
        <h2>{getItemById(Connection.instance.me!.currentWallpaper!)?.name}</h2>
        <p className="muted">
          {getItemById(Connection.instance.me!.currentWallpaper!)?.description}
        </p>
      </div>
    </div>
  );
}
