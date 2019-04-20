import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { LoggerService } from './logger.service';
import { http } from '../static/http';
import { Sync } from '../interface/sync';
import { MessageService, MessageType } from './message.service';
import { AuthenticationService } from './authentication.service';

interface SyncData {
  hasChanged: Sync[];
  newestSyncData: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  syncSteps = 0;
  syncStepsMax = 4;

  constructor(private auth: AuthenticationService,
    private logger: LoggerService,
    private db: DatabaseService,
    private messageService: MessageService) {
  }

  async syncData(username:string, password:string, sendProgress?: (value, max) => void) {
    let p = 1;
    const doSend = function(v) {
      if (sendProgress) {
        sendProgress(v, 5);
      }
    };

    const travelData = []; // this.ToOnlySyncArray(await this.db.GetTravels(this.auth.getUser()));
    doSend(p++);
    const buyItemsData = this.ToOnlySyncArray(await this.db.GetBuyItems());
    doSend(p++);
    const usersData = this.ToOnlySyncArray(await this.db.GetUsers());
    doSend(p++);
    // get all

    const httpData = await http('https://eydsla.strumpur.net/sync.php',
      {
        username: username,
        password: password,
        travels: travelData,
        buyItems: buyItemsData,
        users: usersData
      });
    doSend(p++);

    this.logger.log(httpData);
    for (let i = 0; i < httpData.travels.length; i++) {
      await this.db.AddOrUpdateTravelSecure(httpData.travels[i], true);
    }
    doSend(p++);

    for (let i = 0; i < httpData.buyItems.length; i++) {
      await this.db.AddOrUpdateBuyItem(httpData.buyItems[i], true);
    }
    doSend(p++);

    for (let i = 0; i < httpData.users.length; i++) {
      await this.db.AddOrUpdateUserSecure(httpData.users[i], true);
    }
    doSend(p++);


    this.messageService.sendMessage({type: MessageType.sync});
  }

  private ToOnlySyncArray(data: Sync[]): SyncData {
    const list: Sync[] = [];
    let newestDate: Date;
    data.forEach(element => {
      if (element.needToBeSync) {
        list.push(element);
      } else {
        if (!newestDate || newestDate < element.lastUpdate) {
          newestDate = element.lastUpdate;
        }
      }
    });

    return {hasChanged: list, newestSyncData: newestDate};
  }
}
