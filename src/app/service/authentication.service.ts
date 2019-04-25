import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import * as CryptoJS from 'crypto-js';
import { Encryption } from './../static/encryption';
import { User, UserData, UserSecure } from '../interface/user';
import { http } from '../static/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: User;
  isLogin = false;

  constructor(private httpClient: HttpClient, private database: DatabaseService) {
    const authString = sessionStorage.getItem('Authentication');
    if (authString) {
      this.user = JSON.parse(authString);
      if (this.user) {
        this.isLogin = true;
      }
    }
  }

  public async validPassword(pass: string): Promise<boolean> {
    let dataStr;
    let userDb: UserSecure;
    try  {
      const encryption = new Encryption();
      userDb = await this.database.GetUser(this.user.username);
      dataStr = encryption.decrypt(userDb.secureData, pass);
    } catch {
      return false;
    }

    if (!dataStr || dataStr === '') {
      return false;
    }

    let user;
    try {
      const userData = <UserData>JSON.parse(dataStr);
      user = {
        _id: userDb._id,
        lastUpdate: userDb.lastUpdate,
        needToBeSync: userDb.needToBeSync,
        username: userDb.username,
        data: userData
      };
    } catch {
      return false;
    }

    if (user) {
      return true;
    }

    return false;
  }

  public async login(user: string, pass: string, getFromNet: boolean = true): Promise<boolean> {
    this.isLogin = false;
    this.user = null;
    let dataStr;
    let userDb: UserSecure;
    try  {
      const encryption = new Encryption();
      if (navigator.onLine) {
        try {
          if (getFromNet) {
           userDb = await this.httpClient.post<UserSecure>(
            'https://eydsla.strumpur.net/GetUser.php',
            { username: user }).toPromise();
          }
          if (userDb) {
            await this.database.AddOrUpdateUserSecure(userDb, true);
          }
        } catch {
          userDb = await this.database.GetUser(user);
        }
      } else {
        userDb = await this.database.GetUser(user);
      }
      dataStr = encryption.decrypt(userDb.secureData, pass);
    } catch (e) {
      console.log('Fail to Get user or decrypt ' + e);
      return false;
    }

    if (!dataStr || dataStr === '') {
      console.log('dataStr is empty');
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

      sessionStorage.setItem('Authentication', JSON.stringify(this.user));
    } catch {
      console.log('Error to parse ' + dataStr);
      return false;
    }

    if (this.user) {
      this.isLogin = true;
    }

    return this.isLogin;
  }

  async changePassword(password: string, newPassword: string): Promise<boolean> {
    let dataStr;
    let userDb;
    try  {
      const encryption = new Encryption();
      if (navigator.onLine) {
        try {
           userDb = await this.httpClient.post<UserSecure>(
            'https://eydsla.strumpur.net/ChangePassword.php',
            { username: this.user.username,
              password: password,
              newPassword: newPassword
             }).toPromise();
          
          if (userDb) {
            await this.database.AddOrUpdateUserSecure(userDb, true);
          } else {
            return false;
          }
        } catch {
          return 
        }
      } else {
        return false;
      }
      dataStr = encryption.decrypt(userDb.secureData, newPassword);
    } catch (e) {
      console.log('Fail to Get user or decrypt ' + e);
      return false;
    }

    if (!dataStr || dataStr === '') {
      console.log('dataStr is empty');
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

      sessionStorage.setItem('Authentication', JSON.stringify(this.user));
    } catch {
      console.log('Error to parse ' + dataStr);
      return false;
    }

    if (this.user) {
      this.isLogin = true;
    }

    return this.isLogin;
  }

  logout() {
    sessionStorage.removeItem('Authentication');
    this.user = null;
    this.isLogin = false;
  }

  getUser(): User {
    return this.user;
  }
}
