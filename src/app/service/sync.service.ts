import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseService } from './database.service';
import { LoggerService } from './logger.service';
import { http } from '../static/http';
import { Sync } from '../interface/sync';

interface SyncData {
  hasChanged : Sync[],
  newestSyncData: Date
};

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  syncSteps:number = 0;
  syncStepsMax:number=3;

  constructor(private logger: LoggerService, private db: DatabaseService) 
  { 
  }

  async syncData(sendProgress?: (value, max) => void) {
    let p=1;
    let doSend = function(v) {
      if(sendProgress){
        sendProgress(v, 5);
      }  
    }

    const travelData = this.ToOnlySyncArray(await this.db.GetTravels());
    doSend(p++);
    const buyItemsData = this.ToOnlySyncArray(await this.db.GetBuyItems());
    doSend(p++);
    // get all
    
    var httpData = await http("https://eydsla.strumpur.net/sync.php", 
      {travels: travelData,
      buyItems: buyItemsData});
    doSend(p++);
    
    this.logger.log(httpData);
    for (let i=0; i < httpData.travels.length; i++)
    {
      await this.db.AddOrUpdateTravel(httpData.travels[i], true);
    }
    doSend(p++);

    for (let i=0; i < httpData.buyItems.length; i++)
    {
      await this.db.AddOrUpdateBuyItem(httpData.buyItems[i], true);
    }
    doSend(p++);

  }

  private ToOnlySyncArray(data: Sync[]):SyncData{
    let list:Sync[] = [];
    let newestDate: Date;
    data.forEach(element => {
      if (element.needToBeSync) {
        list.push(element);
      } else {
        if (!newestDate || newestDate < element.lastUpdate){
          newestDate = element.lastUpdate;
        }
      }
    });

    return {hasChanged:list, newestSyncData: newestDate};
  }
}
