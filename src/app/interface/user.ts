import { Sync } from './sync';

export interface UserSecure extends Sync {
    username: string;
    secureData: string;
};

export interface UserDataItem {
    key: string;
};

export interface UserData {
    travels: {[index: string]: UserDataItem
    }
};

export interface User extends Sync {
    username: string;
    data: UserData;
};
