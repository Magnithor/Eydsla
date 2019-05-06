import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { Travel, TravelSecure } from '../interface/travel';
import { BuyItem, BuyItemSecure } from '../interface/buy-item';
import { Currency } from '../interface/currency';
import { MessageService, MessageType } from './message.service';
import { User, UserSecure } from '../interface/user';
import { AuthenticationService } from './authentication.service';
import { NewKey } from '../static/randomKey';
import { Encryption } from '../static/encryption';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private logger: LoggerService,  private messageService: MessageService) { }

  //#region OpenDb and update if need
  private OpenDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('Eydsla', 2);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = <IDBDatabase>(request.result);
        if (event.oldVersion < 1) {
          const travel = db.createObjectStore('travel');
          const buyItem = db.createObjectStore('buyItem');
          buyItem.createIndex('travelId', 'travelId');
          db.createObjectStore('setting');
        }
        if (event.oldVersion < 2) {
          db.createObjectStore('user');
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => this.logger.warn('DatabaseService OpenDb pending till unblocked');
    });
  }
  //#endregion

  public GetCurrencies(): Currency[] {
    // https://en.wikipedia.org/wiki/ISO_4217
    return [
      { id: 'ISK', describe: 'Íslenskar krónur'},
      { id: 'DKK', describe: 'Danskar króur'},
      { id: 'CAD', describe: '$ canada'},
      { id: 'SEK', describe: 'Sænskar króur'},
      { id: 'USD', describe: '$ US'},
      { id: 'GPB', describe: 'Pond'},
      { id: 'EUR', describe: 'Evra'}
     ];
  }

  //#region Travel
  public async AddOrUpdateTravelSecure(travel: TravelSecure) {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('travel', 'readwrite' );
        const store = tx.objectStore('travel');
        const request = store.put(travel, travel._id);
        request.onsuccess = () => {
          this.logger.log(request.result);
          resolve(request.result);
        };
        request.onerror = () => {
          this.logger.error(request.error);
          reject(request.error);
        };
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async UpdateTravel(travel: Travel, user: User) {
    travel.needToBeSync = true;
    travel.lastUpdate = new Date();
    const encryption = new Encryption();

    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('travel', 'readwrite' );
        const store = tx.objectStore('travel');
        const key = user.data.travels[travel._id].key;
        const secure = Object.assign({}, travel);
        delete secure._id;
        delete secure.needToBeSync;
        delete secure.lastUpdate;
        const travelSecure: TravelSecure = {
          _id: travel._id,
          needToBeSync: true,
          lastUpdate: travel.lastUpdate,
          secureData: encryption.encrypt(JSON.stringify(secure), key)
        };
        const request = store.put(travelSecure, travel._id);
        request.onsuccess = () => {
          this.logger.log(request.result);
          resolve(request.result);
          this.messageService.sendMessage({type: MessageType.travel, id: travel._id});

          };
        request.onerror = () => {
          this.logger.error(request.error);
          reject(request.error);
        };
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetTravels(user: User): Promise<Travel[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<Travel[]>((resolve, reject) => {
        const encryption = new Encryption();
        const tx = conn.transaction('travel', 'readonly' );
        const store = tx.objectStore('travel');
        const request = store.openCursor();
        const arr = [];
        request.onsuccess = () => {
          const cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }
          const travelSecure = <TravelSecure>cursor.value;
          const travelInfo = user.data.travels[travelSecure._id];
          if (!travelInfo) {
            cursor.continue();
            return;
          }
          const t = JSON.parse(encryption.decrypt(travelSecure.secureData, travelInfo.key));
          const data = {...travelSecure, ...t};
          delete data.secureData;

          arr.push(this.fixTravelItem(data));
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetTravelSecures(user: User): Promise<TravelSecure[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<TravelSecure[]>((resolve, reject) => {
        const encryption = new Encryption();
        const tx = conn.transaction('travel', 'readonly' );
        const store = tx.objectStore('travel');
        const request = store.openCursor();
        const arr = [];
        request.onsuccess = () => {
          const cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }
          const travelSecure = <TravelSecure>cursor.value;
          const travelInfo = user.data.travels[travelSecure._id];
          if (!travelInfo) {
            cursor.continue();
            return;
          }

          arr.push(travelSecure);
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetTravel(id: string, user: User): Promise<Travel | null> {
    let conn: IDBDatabase;
    const encryption = new Encryption();

    try {
      if (!user.data.travels[id]) {
        return null;
      }

      const key =  user.data.travels[id].key;
      conn = await this.OpenDb();
      return await new Promise<Travel>((resolve, reject) => {
        const tx = conn.transaction('travel', 'readonly' );
        const store = tx.objectStore('travel');
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result) {
            const travelSecure = <TravelSecure>request.result;
            const t = JSON.parse(encryption.decrypt(travelSecure.secureData, key));
            const data = {...travelSecure, ...t};
            delete data.secureData;

            resolve(this.fixTravelItem(data));
          }
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }
  //#endregion

  //#region BuyItem
  public async AddOrUpdateBuyItem(buyItem: BuyItem, user: User) {
    buyItem.needToBeSync = true;
    buyItem.lastUpdate = new Date();
    const encryption = new Encryption();

    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readwrite' );
        const store = tx.objectStore('buyItem');

        const key = user.data.travels[buyItem.travelId].key;
        const secure = Object.assign({}, buyItem);
        delete secure._id;
        delete secure.needToBeSync;
        delete secure.lastUpdate;
        delete secure.travelId;
        const buyItemSecure: BuyItemSecure = {
          _id: buyItem._id,
          travelId: buyItem.travelId,
          needToBeSync: true,
          lastUpdate: new Date(),
          secureData: encryption.encrypt(JSON.stringify(secure), key)
        };

        const request = store.put(buyItemSecure, buyItem._id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async AddOrUpdateBuyItemSecure(buyItem: BuyItem) {
    buyItem.needToBeSync = true;
    buyItem.lastUpdate = new Date();
    const encryption = new Encryption();

    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readwrite' );
        const store = tx.objectStore('buyItem');

        const request = store.put(buyItem, buyItem._id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetBuyItemSecures(user: User): Promise<BuyItemSecure[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItemSecure[]>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const request = store.openCursor();
        const arr = [];
        request.onsuccess = () => {
          const cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }

          const value: BuyItemSecure = cursor.value;
          if (user.data.travels[value.travelId]) {
            arr.push(cursor.value);
          }

          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }
  fixBuyItem(value: BuyItem): BuyItem {
    if (!value) { return value; }

    if (typeof(value.date) === 'string') {
      value.date = new Date(value.date);
    }

    return value;
  }
  fixTravelItem(value: Travel): Travel {
    if (!value) { return value; }

    if (typeof(value.from) === 'string') {
      value.from = new Date(value.from);
    }
    if (typeof(value.to) === 'string') {
      value.to = new Date(value.to);
    }
    return value;
  }

  public async GetBuyItemByTravelId(id: string, user: User): Promise<BuyItem[]> {
    let conn: IDBDatabase;
    const encryption = new Encryption();
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem[]>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const travelId = store.index('travelId');
        const request = travelId.openCursor(id);
        const arr: BuyItem[] = [];
        request.onsuccess = () => {
          const cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }

          const buyItemSecure: BuyItemSecure = cursor.value;
          const t = JSON.parse(encryption.decrypt(buyItemSecure.secureData, user.data.travels[id].key));
          const data = {...buyItemSecure, ...t};
          delete data.secureData;
          arr.push(this.fixBuyItem(data));
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetBuyItemById(id: string, user: User): Promise<BuyItem | null> {
    let conn: IDBDatabase;
    const encryption = new Encryption();
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result) {
            const buyItemSecure: BuyItemSecure = request.result;
            const t = JSON.parse(encryption.decrypt(buyItemSecure.secureData, user.data.travels[buyItemSecure.travelId].key));
            const data = {...buyItemSecure, ...t};
            delete data.secureData;
            resolve(this.fixBuyItem(data));
          }

          resolve(null);
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }
  //#endregion

  //#region Settings
  public async AddOrUpdateSettingItem(key: string, value) {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('setting', 'readwrite');
        const store = tx.objectStore('setting');
        const request = store.put(value, key);
        request.onsuccess = () => {
          resolve(request.result);
          this.messageService.sendMessage({type: MessageType.setting, key: key, value: value });
        };
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetSettingItem(key: string): Promise<any> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<any>((resolve, reject) => {
        const tx = conn.transaction('setting', 'readonly' );
        const store = tx.objectStore('setting');
        const request = store.get(key);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          }

          resolve(null);
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  //#endregion

  //#region User
  public async AddOrUpdateUserSecure(user: UserSecure, notUpdateNeedForSync?: boolean) {
    if (!notUpdateNeedForSync) {
      user.needToBeSync = true;
    }
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('user', 'readwrite' );
        const store = tx.objectStore('user');
        const request = store.put(user, user._id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetUser(username: string): Promise<UserSecure> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<any>((resolve, reject) => {
        const tx = conn.transaction('user', 'readonly' );
        const store = tx.objectStore('user');
        const request = store.getAll();
        request.onsuccess = () => {
          if (request.result) {
            for (let i = 0; i < request.result.length; i++) {
              if (request.result[i].username.toUpperCase() === username.toUpperCase()) {
                resolve(request.result[i]);
                break;
              }
            }
          }

          resolve(null);
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetUsers(): Promise<UserSecure[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<UserSecure[]>((resolve, reject) => {
        const tx = conn.transaction('user', 'readonly' );
        const store = tx.objectStore('user');
        const request = store.openCursor();
        const arr = [];
        request.onsuccess = () => {
          const cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }

          arr.push(cursor.value);
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }
  // #end
}
