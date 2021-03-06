import { NewId } from "../static/id";
import { Sync } from "./sync";
import { CurrencyDefault } from  "./currency";

export interface TravelCategory {
    id: number,
    name: string,
    color: string
}

export interface TravelPerson {
    id: number,
    name: string
}

export interface Travel extends Sync {
    _id: string,
    name: string,
    from: Date,
    to: Date,
    categoryMaxId: number,
    currencies: CurrencyDefault[],
    categories: TravelCategory[],
    personMaxId: number,
    persons: TravelPerson[]
}

export function NewTravel(userId: number):Travel {
    return {
        _id: NewId(),
        from: new Date(),
        to: new Date(),
        name: "",
        categoryMaxId: 0,
        categories: [],
        currencies: [{id:"ISK", trade:1}],
        personMaxId: 0,
        persons: [],
        needToBeSync: true 
    };
}