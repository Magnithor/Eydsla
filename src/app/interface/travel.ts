import { IdToString, NewId } from "./id";

export interface Travel {
    id: string,
    name:string,
    from: Date,
    to: Date
}

export function NewTravel(userId: number):Travel {
    return {
        id: IdToString(NewId(userId)),
        from: new Date(),
        to: new Date(),
        name: ""    
    };
}