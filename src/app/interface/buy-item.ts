import { Id } from './id';

export interface BuyItem {
    id: string,
    travelId: string,
    date: Date,
    caption: string,
    currency,
    price: number
}
