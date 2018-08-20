import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Travel, NewTravel } from '../../interface/travel';
import { LoggerService } from '../../service/logger.service';
import { DatabaseService } from '../../service/database.service';
import { switchMap } from 'rxjs/operators';
import { AlertComponent } from '../alert/alert.component';
import { Currency } from '../../interface/currency';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {

  @ViewChild('alert') alert: AlertComponent;
  @ViewChild('myForm') myForm;
  @ViewChild('currency') selectCurrency;
 
  public currencies: Currency[];
  public filterCurrencies:Currency[];
  
  public travel: Travel;

  constructor(private route: ActivatedRoute, private log: LoggerService, private db: DatabaseService) { 
    this.currencies = this.db.GetCurrencies();
    this.route.paramMap.subscribe(async parm => { 
      if (parm.has("id")) {
        this.travel = await this.db.GetTravel(parm.get('id'));
        this.Filter();     
        this.log.warn(parm.get("id"));
      } else {
        this.travel = NewTravel(1);
        this.Filter();        
      }
    });
  }

  UpdateDate(value) : Date {
    return new Date(value);
  }

  AddCategory() {
    if (!this.travel.categories) {
      this.travel.categories = [];
    }
    this.travel.categories.push( {id: this.travel.categoryMaxId, name:'', color:"red" });
    this.travel.categoryMaxId++;
  }

  AddCurrency() {
    if (this.selectCurrency.nativeElement.value) {
      this.travel.currencies.push({id:this.selectCurrency.nativeElement.value, trade:1});
      this.Filter();
    }
  }

  Filter() {
    this.filterCurrencies = [];
    for (var i = 0; i < this.currencies.length; i++) {
      var found = false;
      for (var o=0; o < this.travel.currencies.length; o++) {
        if (this.currencies[i].id === this.travel.currencies[o].id) {
          found = true;
          break;
        }
      }

      if (!found) {
        this.filterCurrencies.push(this.currencies[i]);
      }
    }
  }

  ngOnInit() {
    this.travel = NewTravel(1);      
  }

  async onSave() {
    
   await this.db.AddOrUpdateTravel(this.travel); 
   this.alert.show("Saved");
  }

}
