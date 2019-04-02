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
  public filterCurrencies: Currency[];
  public travel: Travel;

  constructor(private route: ActivatedRoute, private log: LoggerService, private db: DatabaseService) {
    this.currencies = this.db.GetCurrencies();
    this.route.paramMap.subscribe(async parm => {
      if (parm.has('id')) {
        this.travel = await this.db.GetTravel(parm.get('id'));
        this.Filter();
        this.log.warn(parm.get('id'));
      } else {
        this.travel = NewTravel();
        this.Filter();
      }
    });
  }

  UpdateDate(value): Date {
    return new Date(value);
  }

  AddCategory() {
    if (!this.travel.categories) {
      this.travel.categories = [];
    }
    this.travel.categories.unshift({id: this.travel.categoryMaxId, name: '', color: 'red'});
    this.travel.categoryMaxId++;
  }

  AddCurrency() {
    if (this.selectCurrency.nativeElement.value) {
      this.travel.currencies.push({id: this.selectCurrency.nativeElement.value, trade: 1});
      this.Filter();
    }
  }

  AddPerson() {
    if (!this.travel.persons) {
      this.travel.persons = [];
    }
    if (!this.travel.personMaxId) {
      this.travel.personMaxId = 0;
    }

    this.travel.persons.push({id: this.travel.personMaxId, name: ''});
    this.travel.personMaxId++;
  }

  Filter() {
    this.filterCurrencies = [];
    for (let i = 0; i < this.currencies.length; i++) {
      let found = false;
      for (let o = 0; o < this.travel.currencies.length; o++) {
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
    this.travel = NewTravel();
  }

  async onSave() {
   await this.db.AddOrUpdateTravel(this.travel);
   this.alert.show('Saved');
  }
}
