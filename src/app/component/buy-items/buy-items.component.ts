import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { BuyItem } from '../../interface/buy-item';
import { LoggerService } from '../../service/logger.service';
import { Travel, TravelCategory } from '../../interface/travel';
import { CurrencyDefault } from 'src/app/interface/currency';

@Component({
  selector: 'app-buy-items',
  templateUrl: './buy-items.component.html',
  styleUrls: ['./buy-items.component.css']
})
export class BuyItemsComponent implements OnInit {

  private _travelId;
  public Math = Math;
  public config: { showCurrency:boolean };
   
  @Input()
  set travelId(value: string) {
    this._travelId = value;
    this.getTravelId(value);
  }
 
  get travelId(): string { 
    return this._travelId; 
  }

  data: BuyItem[];
  categories: TravelCategory[];
  currencies: {[index: string]: number};

  constructor(private db:DatabaseService, private log: LoggerService) { 
    this.config = { showCurrency:false };
  }

  ngOnInit() {
  }

  async getTravelId(id) {
    const travel = await this.db.GetTravel(id);
    this.categories = [];
    this.currencies = {};
    for (var i=0; i < travel.categories.length; i++) {
      this.categories[travel.categories[i].id] = travel.categories[i];
    }
    for (var i=0; i < travel.currencies.length; i++) {
      this.currencies[travel.currencies[i].id] = travel.currencies[i].trade;
    }
    const data  = await this.db.GetBuyItemByTravelId(id);
    data.sort((a,b)=> b.date.getTime() - a.date.getTime());
    this.data = data;
  }

  getAfterDot(value:number) {
    let str = value.toString();
    let i = str.indexOf('.');
    if (i == -1) { return ""; }
    return str.substr(i).replace('.',',');
  }

  dateToStr(value:Date): string {   
    let v =         
     ("0" + (value.getMonth()+1)).substr(-2) + "/"
    + ("0" + value.getDate()).substr(-2) ;
    /*+ " "
    + ("0" + value.getHours()).substr(-2) + ":"
    + ("0" + value.getMinutes()).substr(-2);
*/
    return v;   
  }

  categoryToStr(value) {       
    const v= this.categories[value]
    if (!v) { return null; }
    return  v.name;
  }

  empty(value) {
    if (!value) { return "[empty]"; }
    return value;
  }

  calcISK(value:BuyItem): number {
    if (value.currency === null || value.currency === undefined) {
      return null;
    }

    var currencyValue;
    if (value.currencyValue === null || value.currencyValue === undefined) {
      currencyValue = null;
    } else {
      currencyValue = value.currencyValue;
    }

    if (currencyValue === null) {
      currencyValue = this.currencies[value.currency];
    }

    return currencyValue * value.price;
  }
}
