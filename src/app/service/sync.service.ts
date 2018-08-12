import { Injectable } from '@angular/core';
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

  constructor(private logger: LoggerService, private db: DatabaseService) 
  { 
  }

  async syncData() {
    let i;
    const travelData = this.ToOnlySyncArray(await this.db.GetTravels());
    // get all
    
    var httpData = await http("http://eydsla.strumpur.net/sync.php", 
      {travel:travelData});
    
    this.logger.log(httpData);
    for (i=0; i < httpData.travels.length; i++)
    {
      await this.db.AddOrUpdateTravel(httpData.travels[i], true);
    };
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
