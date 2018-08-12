import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { Travel } from './../interface/travel';
import { Id, IdToString } from './../interface/id';
import { BuyItem } from '../interface/buy-item';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private logger: LoggerService) { }

  //#region OpenDb and update if need
  private OpenDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('Eydsla', 1);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        var db = <IDBDatabase>(request.result);
        const travel = db.createObjectStore("travel");
        const buyItem = db.createObjectStore("buyItem");
        buyItem.createIndex("travelId", "travelId");
        db.createObjectStore("setting");
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => this.logger.warn('DatabaseService OpenDb pending till unblocked');
    });
  };
  //#endregion

  //#region Travel
  public async AddOrUpdateTravel(travel: Travel, notUpdateNeedForSync?:boolean) {   
    if (!notUpdateNeedForSync) {
      travel.needToBeSync = true;
    }

    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('travel', 'readwrite' );
        const store = tx.objectStore('travel');
        const request = store.put(travel, IdToString(travel.id));
        request.onsuccess = () => { 
          this.logger.log(request.result);
          resolve(request.result);
        }
        request.onerror = () => {
          this.logger.error(request.error);
          reject(request.error);
        }
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  };

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
          let cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }

          arr.push(cursor.value);
          cursor.continue();
        }

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetTravel(id: Id | string):Promise<Travel | null> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<Travel>((resolve, reject) => {
        const tx = conn.transaction('travel', 'readonly' );
        const store = tx.objectStore('travel');
        const request = store.get(IdToString(id));
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          }

          resolve(null);
        }

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }
  //#endregion

  //#region BuyItem
  public async AddOrUpdateBuyItem(buyItem: BuyItem) {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      await new Promise((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readwrite' );
        const store = tx.objectStore('buyItem');
        const request = store.put(buyItem, IdToString(buyItem.id));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  };

  public async GetBuyItemByTravelId(id:Id): Promise<BuyItem[]> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem[]>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const travelId = store.index('travelId');
        const request = travelId.openCursor(IdToString(id));
        const arr: BuyItem[] = [];
        request.onsuccess = () => {
          let cursor = <IDBCursorWithValue> (request.result);
          if (!cursor) {
            resolve(arr);
            return;
          }

          arr.push(cursor.value);
          cursor.continue();
        }

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }

  public async GetBuyItemById(id: Id | string):Promise<BuyItem | null> {
    let conn: IDBDatabase;
    try {
      conn = await this.OpenDb();
      return await new Promise<BuyItem>((resolve, reject) => {
        const tx = conn.transaction('buyItem', 'readonly' );
        const store = tx.objectStore('buyItem');
        const request = store.get(IdToString(id));
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          }

          resolve(null);
        }

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
        const tx = conn.transaction('setting', 'readwrite' );
        const store = tx.objectStore('setting');
        const request = store.put(value, key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  };  
  
  public async GetSettingItem(key: string):Promise<any> {
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
        }

        request.onerror = () => reject(request.error);
      });
    }
    finally {
      if (conn) { conn.close(); }
    }
  }


  //#endregion
}