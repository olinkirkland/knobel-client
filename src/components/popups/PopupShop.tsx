import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import { rootElement } from '../..';
import Connection, {
  ConnectionEventType,
  SERVER_URL
} from '../../controllers/connection';
import Terminal from '../../controllers/terminal';
import Item, { getItemById } from '../../data/item';
import { me } from '../../data/user';
import { numberComma } from '../../utils';
import { ShopCollection } from '../ShopCollection';
interface PopupShopProps extends PopupProps {}

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

type State = {
  shopItems: ShopItem[];
  featuredSales: Sale[];
};

export class PopupShop extends React.Component<PopupShopProps> {
  public readonly state: State = {
    shopItems: [],
    featuredSales: []
  };

  public componentDidMount() {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );

    // Get shop data
    axios
      .get(SERVER_URL + 'shop')
      .then((res) => {
        // Set shop data
        console.log(res.data);
        this.setShopData(res.data);
      })
      .catch((err) => {
        Terminal.log('⚠️', err);
      });
  }

  public componentWillUnmount() {
    Connection.instance.removeListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );
  }

  private onUserDataChanged() {
    this.forceUpdate();
  }

  private setShopData(data: ShopData) {
    const shopItems = data.prices.map((price: Price) => {
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
    });

    const saleItems = shopItems.filter((item: ShopItem) => {
      return item.discount > 0;
    });

    this.setState({
      shopItems,
      saleItems
    });
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-shop">
          <div className="popup-header">
            <span>Shop</span>
            <div className="gold-box h-group">
              <img src="assets/icons/coin.png" alt="" />
              <span className="gold-text">{numberComma(me.gold!)}</span>
            </div>
            <button className="btn-link btn-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            {this.state.shopItems.length > 0 && (
              <ShopCollection name="Shop" items={this.state.shopItems} />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
