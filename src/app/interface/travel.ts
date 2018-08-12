import { NewId } from "../static/id";
import { Sync } from "./sync";

export interface TravelCategory {
    id: number,
    name: string,
    color: string
}

export interface Travel extends Sync {
    _id: string,
    name: string,
    from: Date,
    to: Date,
    categoryMaxId: number,
    category: TravelCategory[]
}

export function NewTravel(userId: number):Travel {
    return {
        _id: NewId(),
        from: new Date(),
        to: new Date(),
        name: "",
        categoryMaxId: 0,
        category: [],
        needToBeSync: true  
    };
}