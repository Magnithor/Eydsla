import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { Travel } from '../interface/travel';
import { BuyItem } from '../interface/buy-item';
import { Currency } from '../interface/currency';
import { MessageService, MessageType } from './message.service';
import { User, UserSecure } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private logger: LoggerService,  private messageService: MessageService) { }

  //#region OpenDb and update if need
  private OpenDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('Eydsla', 1);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = <IDBDatabase>(request.result);
        const travel = db.createObjectStore('travel');
        const buyItem = db.createObjectStore('buyItem');
        buyItem.createIndex('travelId', 'travelId');
        db.createObjectStore('setting');
        db.createObjectStore('user');
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
      { id: 'GPB', describe: 'Pond'}
     ];
  }

  //#region Travel
  public async AddOrUpdateTravel(travel: Travel, notUpdateNeedForSync?: boolean) {
    if (!notUpdateNeedForSync) {
      travel.needToBeSync = true;
    }

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
          if (!notUpdateNeedForSync) {
            this.messageService.sendMessage({type: MessageType.travel, id: travel._id});
          }
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

  public async GetTravels(): Promise<Travel[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<Travel[]>((resolve, reject) => {
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

          arr.push(this.fixTravelItem(cursor.value));
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetTravel(id: string): Promise<Travel | null> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<Travel>((resolve, reject) => {
        const tx = conn.transaction('travel', 'readonly' );
        const store = tx.objectStore('travel');
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result) {
            resolve(this.fixTravelItem(request.result));
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
  public async AddOrUpdateBuyItem(buyItem: BuyItem, notUpdateNeedForSync?: boolean) {
    if (!notUpdateNeedForSync) {
      buyItem.needToBeSync = true;
    }
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

  public async GetBuyItems(): Promise<BuyItem[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem[]>((resolve, reject) => {
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

          arr.push(this.fixBuyItem(cursor.value));
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

  public async GetBuyItemByTravelId(id: string): Promise<BuyItem[]> {
    let conn: IDBDatabase;
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

          arr.push(this.fixBuyItem(cursor.value));
          cursor.continue();
        };

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetBuyItemById(id: string): Promise<BuyItem | null> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const request = store.get(id);
        request.onsuccess = () => {
          if (request.result) {
            resolve(this.fixBuyItem(request.result));
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
  public async AddOrUpdateUser(user: User, notUpdateNeedForSync?: boolean) {
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
  // #end
}
