import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private database:DatabaseService) {

  }

  isLogin = false;
  set(keys:string, value:string):string {
    const key = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  setObject(keys:string, value:any):string{
    return this.set(keys, JSON.stringify(value));
  }

  get(keys:string, value:string):string {
    const key = CryptoJS.enc.Utf8.parse(keys);
    const iv = CryptoJS.enc.Utf8.parse(keys);
    const decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  getObject(key:string, value:string):any {
    return JSON.parse(this.get(key,value));
  }

  public async login(user:string, pass:string):Promise<boolean> {
    this.isLogin = false;
    let dataStr;
    try  {
    const userDate = await this.database.GetUser(user);

    dataStr = this.get(pass, userDate.secureData);
    } catch{
      return false;
    }
    if (!dataStr || dataStr === "") {
      return false;
    }

    let userData;
    try {
      userData = JSON.parse(dataStr);
    } catch {
      return false;
    }

    if (userData) {
      this.isLogin = true;
      return true;
    } else {
      return false;
    }
  }
}
