import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import * as CryptoJS from 'crypto-js';
import { Encryption } from './../static/encryption';
import { User, UserData, UserSecure } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user:User;
  constructor(private database: DatabaseService) {

  }

  isLogin = false;

  public async login(user: string, pass: string): Promise<boolean> {
    this.isLogin = false;
    this.user = null;
    let dataStr;
    let userDb: UserSecure;
    let encryption = new Encryption();
    try  {
      userDb = await this.database.GetUser(user);
      dataStr = encryption.decrypt(userDb.secureData, pass);    
    } catch {
      return false;
    }

    if (!dataStr || dataStr === '') {
      return false;
    }

    try {
      const userData = <UserData>JSON.parse(dataStr);
      this.user = {
        _id: userDb._id,
        lastUpdate: userDb.lastUpdate,
        needToBeSync: userDb.needToBeSync,
        username: userDb.username,
        data: userData
      };
    } catch {
      return false;
    }

    if (this.user) {
      this.isLogin = true;
    } 
      
    return this.isLogin;    
  }

  getUser(): User {
    return this.user;
  }
}
