import { IdToString, NewId } from "./id";
import { Sync } from "./sync";

export interface TravelCategory {
    id: number,
    name: string,
    color: string
}

export interface Travel extends Sync {
    id: string,
    name: string,
    from: Date,
    to: Date,
    categoryMaxId: number,
    category: TravelCategory[]
}

export function NewTravel(userId: number):Travel {
    return {
        id: IdToString(NewId(userId)),
        from: new Date(),
        to: new Date(),
        name: "",
        categoryMaxId: 0,
        category: [],
        needToBeSync: true  
    };
}