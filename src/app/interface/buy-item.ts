import { NewId } from '../static/id';
import { Sync } from './sync';

export interface PersonSpentPrice {
    personId: number;
    price: number;
}

export interface PersonSpentPercent {
    personId: number;
    percent: number;
}

export interface BuyItem extends Sync {
    _id: string;
    travelId: string;
    date: Date;
    caption: string;
    currency: string;
    price: number;
    currencyValue: number;
    category?: number;
    personsSpent?: (PersonSpentPrice | PersonSpentPercent)[];
}

export function NewBuyItem(travelId: string, userId: number): BuyItem {
    return {
        _id: NewId(),
        travelId: travelId,
        date: new Date(),
        caption: '',
        currency: '',
        price: null,
        currencyValue: null,
        needToBeSync: true
    };
}
