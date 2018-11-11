import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public getValue(key: string): string {
    return localStorage.getItem(key);
  }

  public getValueObject(key: string): object {
    return JSON.parse(this.getValue(key));
  }

  public setValue(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public setValueObject(key: string, value: object) {
    this.setValue(key, JSON.stringify(value));
  }
}
