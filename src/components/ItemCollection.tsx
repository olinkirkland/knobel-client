import Item, { getItemById } from '../data/item';
import { me } from '../data/user';

type Props = {
  title: string;
  items: Item[];
};

export function AvatarItemCollection({ title, items }: Props) {
  // Create an array of unique items from the items array with quantity
  type ItemWithQuantity = {
    item: Item;
    quantity: number;
  };

  let itemsWithQuantity: ItemWithQuantity[] = [];
  items.forEach((item) => {
    const itemWithQuantity = itemsWithQuantity.find(
      (i) => i.item.id === item.id
    );
    if (itemWithQuantity) itemWithQuantity.quantity++;
    else itemsWithQuantity.push({ item: item, quantity: 1 });
  });

  return (
    <div className="item-collection">
      <h2>{`${title} (${items.length})`}</h2>
      <ul>
        {itemsWithQuantity.map((itemWithQuantity) => {
          const item = itemWithQuantity.item;
          const quantity = itemWithQuantity.quantity;
          return (
            <li
              onClick={() => {
                // Connection.instance.changeAvatar(item.id);
              }}
              key={item.id}
              className={
                me?.avatar === item.id ? 'avatar-item selected' : 'avatar-item'
              }
            >
              <img src={`assets/${item.value.url}`} alt="" />
              {quantity > 1 && <span className="quantity">x{quantity}</span>}
            </li>
          );
        })}
      </ul>

      <div className="item-definition">
        <h2>{getItemById(me.avatar!)?.name}</h2>
        <p className="muted">{getItemById(me.avatar!)?.description}</p>
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
              // Connection.instance.changeWallpaper(item.id);
            }}
            key={item.id}
            className={
              me.wallpaper === item.id
                ? 'wallpaper-item selected'
                : 'wallpaper-item'
            }
          >
            <img src={`assets/${item.value.url}`} alt="" />
          </li>
        ))}
      </ul>
      <div className="item-definition">
        <h2>{getItemById(me.wallpaper!)?.name}</h2>
        <p className="muted">{getItemById(me.wallpaper!)?.description}</p>
      </div>
    </div>
  );
}
