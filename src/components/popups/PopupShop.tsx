import axios from 'axios';
import { useEffect, useState } from 'react';
import Connection, {
  ConnectionEventType,
  SERVER_URL
} from '../../controllers/connection';
import { text } from '../../controllers/locale';
import PopupMediator from '../../controllers/popupMediator';
import Terminal from '../../controllers/terminal';
import Item, { getItemById } from '../../data/item';
import { me } from '../../data/user';
import { numberComma } from '../../utils';
import { ShopCollection } from '../ShopCollection';

export interface Discount {
  id: string; // Item ID
  percent: number; // % off of price
}

export interface Sale {
  name: string; // Sale name
  description: string; // Sale description
  featured: boolean; // Show the sale in its own collection
  discounts: Discount[]; // Discounts
}

export interface Price {
  id: string; // Item ID
  price: number; // Price
}

export interface ShopData {
  sales: Sale[]; // Sales
  prices: Price[]; // Price list
}

export interface ShopItem extends Item {
  discount: number;
  price: number;
  finalPrice: number;
}

export function PopupShop() {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [featuredSales, setFeaturedSales] = useState<Sale[]>([]);

  useEffect(() => {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      onUserDataChange
    );

    // Fetch shop data
    axios
      .get(SERVER_URL + 'shop')
      .then((res) => {
        applyShopData(res.data);
      })
      .catch((err) => {
        Terminal.log('⚠️', err);
      });
  }, []);

  const [value, setValue] = useState(0); // integer state
  function onUserDataChange() {
    return () => setValue((value) => value + 1); // update the state to force render
  }

  function applyShopData(data: ShopData) {
    setShopItems(
      data.prices.map((price: Price) => {
        const item: ShopItem = {
          ...getItemById(price?.id)!,
          price: price?.price,
          discount: 0,
          finalPrice: price?.price
        };

        // Determine the price
        if (data.sales.length > 0) {
          data.sales.forEach((sale: Sale) => {
            sale.discounts.forEach((discount: Discount) => {
              if (discount.id === item.id) {
                item.discount = discount.percent;
              }
            });
          });
        }

        item.finalPrice = Math.floor(
          item.price - item.price * (item.discount / 100)
        );

        return item;
      })
    );

    // const saleItems = shopItems.filter((item: ShopItem) => {
    //   return item.discount > 0;
    // });
  }

  return (
    <div className="modal">
      <div className="popup popup-shop">
        <div className="popup-header">
          <span>{text('shop')}</span>
          <div className="gold-box h-group">
            <img src="assets/icons/coin.png" alt="" />
            <span className="gold-text">{numberComma(me.gold!)}</span>
          </div>
          <button className="btn-link btn-close" onClick={PopupMediator.close}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="popup-content">
          {shopItems.length > 0 && (
            <ShopCollection name={text('shop')} items={shopItems} />
          )}
        </div>
      </div>
    </div>
  );
}
