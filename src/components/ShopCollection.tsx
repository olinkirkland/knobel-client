import { useEffect, useState } from 'react';
import Connection, { ConnectionEventType } from '../connection/Connection';
import { numberComma } from '../Util';
import ButtonBar from './ButtonBar';
import Checkbox from './Checkbox';
import { ShopItem } from './popups/PopupShop';
import { VerticalSeparator } from './VerticalSeparator';

type Props = {
  name: string;
  description?: string;
  items: ShopItem[];
  sale?: boolean;
  countdownDate?: Date;
};

enum PRICE_FILTER {
  ALL = 'all',
  ON_SALE = 'on-sale',
  AFFORDABLE = 'affordable'
}

enum TYPE_FILTER {
  AVATARS = 'avatars',
  WALLPAPERS = 'wallpapers'
}

export function ShopCollection({
  sale = false,
  name,
  description = '',
  items
}: Props) {
  const [inventory, setInventory] = useState(Connection.instance.me!.inventory);
  const [gold, setGold] = useState(Connection.instance.me!.gold);
  const [filter, setFilter] = useState({
    showOwnedItems: true,
    priceFilter: PRICE_FILTER.ALL,
    typeFilter: TYPE_FILTER.AVATARS
  });
  const [currentItems, setCurrentItems] = useState(items);

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

  useEffect(() => {
    setCurrentItems(
      items.filter((item) => {
        // Show owned?
        if (!filter.showOwnedItems && inventory!.indexOf(item.id)! >= 0)
          return false;

        // On sale?
        if (filter.priceFilter === PRICE_FILTER.ON_SALE && item.discount === 0)
          return false;

        // Affordable?
        if (
          filter.priceFilter === PRICE_FILTER.AFFORDABLE &&
          gold! < item.finalPrice &&
          inventory!.indexOf(item.id)! < 0
        )
          return false;

        // Type?
        if (filter.typeFilter === TYPE_FILTER.AVATARS && item.type !== 'avatar')
          return false;
        if (
          filter.typeFilter === TYPE_FILTER.WALLPAPERS &&
          item.type !== 'wallpaper'
        )
          return false;

        return true;
      })
    );
  }, [
    filter.priceFilter,
    filter.showOwnedItems,
    filter.typeFilter,
    gold,
    inventory,
    items
  ]);

  function onUserDataChanged() {
    console.log('ShopCollection: onUserDataChanged');
    setInventory(Connection.instance.me!.inventory);
    setGold(Connection.instance.me!.gold);
  }

  return (
    <div className="shop-collection">
      {!sale && (
        <div className="h-group controls">
          <div className="h-group">
            <ButtonBar>
              <button
                onClick={() => {
                  setFilter({
                    ...filter,
                    priceFilter: PRICE_FILTER.ALL
                  });
                }}
                className="selected"
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilter({
                    ...filter,
                    priceFilter: PRICE_FILTER.ON_SALE
                  });
                }}
              >
                <img src="assets/icons/sale.png" alt="" />
                On Sale
              </button>
              <button
                onClick={() => {
                  setFilter({
                    ...filter,
                    priceFilter: PRICE_FILTER.AFFORDABLE
                  });
                }}
              >
                Affordable
              </button>
            </ButtonBar>
            <VerticalSeparator />
            <ButtonBar>
              <button
                onClick={() => {
                  setFilter({
                    ...filter,
                    typeFilter: TYPE_FILTER.AVATARS
                  });
                }}
                className="selected"
              >
                Avatars
              </button>
              <button
                onClick={() => {
                  setFilter({
                    ...filter,
                    typeFilter: TYPE_FILTER.WALLPAPERS
                  });
                }}
              >
                Wallpapers
              </button>
            </ButtonBar>
          </div>
          <Checkbox
            value={true}
            checked={(b: boolean) => {
              setFilter({
                ...filter,
                showOwnedItems: b
              });
            }}
            text="Show owned items"
          />
        </div>
      )}
      {description.length > 0 && <p>{description}</p>}
      <ul>
        {currentItems.map((item, index) => (
          <li className="shop-card" key={index}>
            <div className="shop-card-body">
              <p className="item-type">{item.type}</p>
              <p className="item-name">{item.name}</p>
              <img src={`assets/${item.value.url}`} alt="[Not found]" />
              <p className="item-description">{item.description}</p>
            </div>
            {item.discount > 0 && (
              <span className="sale-banner">-{item.discount}%</span>
            )}
            <div className="shop-card-footer">
              {inventory!.indexOf(item.id) === -1 && (
                <>
                  {gold && (
                    <button
                      className={`price ${
                        gold! < item.finalPrice && 'disabled'
                      }`}
                      onClick={() => Connection.instance.buyItem(item.id)}
                    >
                      {item.discount > 0 && (
                        <span className="old-price">
                          &nbsp;{numberComma(item.price)}&nbsp;
                        </span>
                      )}
                      {(item.finalPrice === 0 && <p>FREE!</p>) ||
                        (item.finalPrice > 0 && (
                          <>
                            <img src="assets/icons/coin.png" alt="" />
                            <p>{numberComma(item.finalPrice)}</p>
                          </>
                        ))}
                    </button>
                  )}
                </>
              )}
              {inventory!.indexOf(item.id)! >= 0 && <p>Owned</p>}
            </div>
          </li>
        ))}
      </ul>
      {/* // If ul has no children, show this element */}
      {items.length === 0 && <p>No items found</p>}
    </div>
  );
}
