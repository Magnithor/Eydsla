import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { BuyItem, NewBuyItem, PersonSpentPercent, PersonSpentPrice } from '../../interface/buy-item';
import { Travel, TravelPerson } from '../../interface/travel';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../service/logger.service';
import { DatabaseService } from '../../service/database.service';
import { AlertComponent } from '../alert/alert.component';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  @ViewChild('alert') alert: AlertComponent;

  public buyItem: BuyItem;
  public travel: Travel;
  filterPersons: TravelPerson[];
  precentPersonSum: number;
  pricePersonSum: number;
  personSum: number;
 
  private _categoryColor: string;
  @Input()
  set categoryColor(value: string) {
    this._categoryColor = value;
  }
  get categoryColor(): string {
    return this._categoryColor;
  }

  constructor(private route: ActivatedRoute, private log: LoggerService, private db: DatabaseService, private localStorageService: LocalStorageService) { 
    this.route.paramMap.subscribe(async parm => { 
      if (parm.has("id")) {
        let buyItem = await this.db.GetBuyItemById(parm.get('id'));
        this.travel = await this.db.GetTravel(buyItem.travelId);
        this.buyItem = buyItem;
      }  else {
        if (parm.has("travelId")){
          let buyItem = NewBuyItem(parm.get("travelId"), 1);
          this.travel = await this.db.GetTravel(buyItem.travelId);
          this.buyItem = buyItem;
          this.setDeafultCurrency();
        } else {
          let travelId = await this.db.GetSettingItem('SelectTravel');
          this.travel = await this.db.GetTravel(travelId);
          this.buyItem = NewBuyItem(travelId, 1);
          this.setDeafultCurrency();          
        }
      }

      this.UpdateColor();
      this.UpdatePeopleFilter();
      this.UpdatePersonValues();
    });
  }

  ngOnInit() {
    this.buyItem = NewBuyItem("1", 1);
  }
  
  setDeafultCurrency() {
    let defaultCurrency = this.localStorageService.getValue("DefaultCurrency");
    let found = false;
    
    for (var i = 0; i < this.travel.currencies.length; i++) {
      if (this.travel.currencies[i].id === defaultCurrency){
        found = true;
        this.buyItem.currency = defaultCurrency;
        break;
      }
    }
  }

  async onSave() {    
    await this.db.AddOrUpdateBuyItem(this.buyItem); 
    this.localStorageService.setValue("DefaultCurrency", this.buyItem.currency);
    this.alert.show("Saved");
  }

  UpdateColor():void  {
    if (this.buyItem.category === null || this.buyItem.category === undefined)
    {
      this.categoryColor = null;
      return;
    }
    
    for (var i=0; i < this.travel.categories.length; i++){
      if (this.travel.categories[i].id == this.buyItem.category) {
        this.categoryColor = this.travel.categories[i].color;
        return;
      }
    }
    this.categoryColor = null;
  }
  
  UpdatePeopleFilter() {
    let list = [];
    for (let i = 0; i < this.travel.persons.length; i++) {
      let skip = false;
      if (this.buyItem.personsSpent) {
        for (let p=0; p < this.buyItem.personsSpent.length; p++) {
          if (this.buyItem.personsSpent[p].personId == this.travel.persons[i].id) {
            skip = true;
          }
        }
      }

      if (!skip) {
        list.push(this.travel.persons[i]);
      }
    }
    
    this.filterPersons = list;
  }

  getPersionFromId(id) {
    for (let i =0; i < this.travel.persons.length; i++) {
      if (this.travel.persons[i].id == id){
        return this.travel.persons[i].name;
      }
    }

    return id;
  }
  AddPersonPrice(id) {
    if (!this.buyItem.personsSpent) { this.buyItem.personsSpent = []; }
    this.buyItem.personsSpent.push( {personId: id, price: 0} );
    this.UpdatePeopleFilter();
  }

  AddPersonPercent(id) {
    if (!this.buyItem.personsSpent) { this.buyItem.personsSpent = []; }
    this.buyItem.personsSpent.push( { personId: id, percent: 0} );
    this.UpdatePeopleFilter();
  }

  UpdatePersonValues() {
    if (!this.buyItem.personsSpent) {
      this.precentPersonSum  = undefined;
      this.pricePersonSum = undefined
      this.personSum = undefined;
      return;
    }

    let percent = 0;
    let price = 0;
    for (let i = 0; i < this.buyItem.personsSpent.length; i++) {
      let spent = this.buyItem.personsSpent[i];
      if ((spent as PersonSpentPercent).percent !== undefined) {
        percent += (spent as PersonSpentPercent).percent;
      }
      if ((spent as PersonSpentPrice).price !== undefined) {
        price += (spent as PersonSpentPrice).price;
      }
    }

    if (percent > 0) { 
      percent = percent /100; 
      this.precentPersonSum = -(this.buyItem.price * percent);
    } else {
      this.precentPersonSum = 0;
    }
    this.pricePersonSum = -price;

    this.personSum = this.buyItem.price + this.precentPersonSum + this.pricePersonSum;

  }
}