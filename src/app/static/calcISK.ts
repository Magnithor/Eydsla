import { BuyItem } from '../interface/buy-item';
import { Travel } from '../interface/travel';

export function calcISK(value: BuyItem, travel: Travel): number {
    if (value.currency === null || value.currency === undefined) {
      return null;
    }

    let currencyValue;
    if (value.currencyValue === null || value.currencyValue === undefined) {
      currencyValue = null;
    } else {
      currencyValue = value.currencyValue;
    }

    if (currencyValue === null) {
      for (let i = 0; i < travel.currencies.length; i++) {
        if (travel.currencies[i].id === value.currency) {
          currencyValue = travel.currencies[i].trade;
          break;
        }
      }
    }

    return currencyValue * value.price;
  }
