import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { LoggerService } from './logger.service';
import { http } from '../static/http';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private logger: LoggerService, private db: DatabaseService) 
  { 
  }

  async syncData() {
    const travelData = await this.db.GetTravels();
    await http("http://eydsla.strumpur.net/sync.php", travelData);
  }
}
