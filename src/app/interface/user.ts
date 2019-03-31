import { Sync } from "./sync";

export interface UserSecure extends Sync {
    username: string;
    secureData: string;
}

export interface User extends Sync {
    username: string;
    data: {
        travels:{[index:string]:{            
            key:string}
        }
    }
}