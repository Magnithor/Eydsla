import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { BuyItem } from '../../interface/buy-item';
import { LoggerService } from '../../service/logger.service';

@Component({
  selector: 'app-buy-items',
  templateUrl: './buy-items.component.html',
  styleUrls: ['./buy-items.component.css']
})
export class BuyItemsComponent implements OnInit {

  private _travelId;
   
  @Input()
  set travelId(value: string) {
    this._travelId = value;
    this.getTravelId(value);
  }
 
  get travelId(): string { 
    return this._travelId; 
  }

  data: BuyItem[];

  constructor(private db:DatabaseService, private log: LoggerService) { }

  ngOnInit() {
  }

  async getTravelId(id) {
    const data  = await this.db.GetBuyItemByTravelId(id);
    data.sort((a,b)=> b.date.getTime() - a.date.getTime());
    this.data = data;
  }

}
