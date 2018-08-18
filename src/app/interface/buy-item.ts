import { NewId } from "../static/id";
import { Sync } from "./sync";

export interface BuyItem extends Sync {
    _id: string,
    travelId: string,
    date: Date,
    caption: string,
    currency,
    price: number
}

export function NewBuyItem(travelId: string, userId: number) : BuyItem {
    return {
        _id: NewId(),
        travelId: travelId,
        date: new Date(),
        caption: "",
        currency: "",
        price: 0,
        needToBeSync: true
    };
}