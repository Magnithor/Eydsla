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
  public Math = Math;
   
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

  getAfterDot(value:number){
    let str = value.toString();
    let i = str.indexOf('.');
    if (i == -1) { return ""; }
    return str.substr(i).replace('.',',');
  }
}
