import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { PopupProps } from 'react-popup-manager';
import Connection, {
  ConnectionEventType,
  MyUserData,
  url
} from '../../connection/Connection';
import Terminal from '../../controllers/Terminal';
import { rootElement } from '../../index';
import Item, { getItemById } from '../../models/Item';
import { numberComma } from '../../Util';
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
  price: number;
  discount: number;
  finalPrice: number;
}

type State = {
  shopItems: ShopItem[];
  featuredSales: { sale: Sale; items: ShopItem[] }[];
  user: MyUserData | null;
};

export class PopupShop extends React.Component<PopupShopProps> {
  public readonly state: State = {
    user: Connection.instance.me!,
    shopItems: [],
    featuredSales: []
  };

  private onUserDataChanged() {
    const connection = Connection.instance;
    this.setState({
      user: connection.me
    });
  }

  public componentDidMount() {
    Connection.instance.addListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged.bind(this)
    );

    // Get shop data
    axios
      .get(`${url}shop/`)
      .then((res) => {
        // Set shop data
        this.setShopData(res.data);
      })
      .catch((err) => {
        Terminal.log('⚠️', err);
      });
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
      data.sales.forEach((sale: Sale) => {
        sale.discounts.forEach((discount: Discount) => {
          if (discount.id === item.id) {
            item.discount = discount.percent;
          }
        });
      });

      item.finalPrice = Math.floor(
        item.price - item.price * (item.discount / 100)
      );

      return item;
    });

    data.sales.forEach((sale: Sale) => {
      if (sale.featured) {
        const saleItems: ShopItem[] = [];
        sale.discounts.forEach((discount: Discount) => {
          const item: ShopItem = shopItems.find((i: ShopItem) => {
            return i.id === discount.id;
          })!;

          saleItems.push(item);
        });

        this.setState({
          featuredSales: [
            ...this.state.featuredSales,
            { sale: sale, items: saleItems }
          ]
        });
      }
    });

    this.setState({
      shopItems
    });
  }

  public componentWillUnmount() {
    const connection = Connection.instance;
    connection.removeListener(
      ConnectionEventType.USER_DATA_CHANGED,
      this.onUserDataChanged
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const me = Connection.instance.me!;
    if (!me) return <></>;

    if (!this.state.user) return <></>;
    return (
      <Modal isOpen={isOpen!} appElement={rootElement!} className="modal">
        <div className="popup popup-shop">
          <div className="popup-header">
            <span>Shop</span>
            <div className="gold-box h-group">
              <img src="assets/icons/coin.png" alt="" />
              <span>{numberComma(this.state.user.gold!)}</span>
            </div>
            <button className="button-close" onClick={onClose}>
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="popup-content">
            {/* {this.state.featuredSales.length > 0 &&
              this.state.featuredSales.map((saleAndItems) => {
                return (
                  <div className="v-group">
                    <div className="sale-header v-group">
                      <span>{saleAndItems.sale.name}</span>
                      <span className="muted">
                        {saleAndItems.sale.description}
                      </span>
                    </div>
                    <ShopCollection
                      sale={true}
                      name={saleAndItems.sale.name}
                      items={saleAndItems.items}
                      // countdownDate={saleAndItems.sale.countdownDate}
                    />
                  </div>
                );
              })} */}

            {this.state.shopItems.length > 0 && (
              <ShopCollection name="Shop" items={this.state.shopItems} />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
