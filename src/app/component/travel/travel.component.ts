import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Travel, NewTravel } from '../../interface/travel';
import { LoggerService } from '../../service/logger.service';
import { DatabaseService } from '../../service/database.service';
import { AlertComponent } from '../alert/alert.component';
import { Currency } from '../../interface/currency';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { http } from 'src/app/static/http';

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
  public guiSwitch: String;
  public newItem: boolean;
  public username: string;
  public password: string;
  public wrongUserNameOrPassword: boolean;

  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private log: LoggerService,
    private db: DatabaseService) {
    this.username = auth.getUser().username;
    this.wrongUserNameOrPassword = false;
    this.currencies = this.db.GetCurrencies();
    this.route.paramMap.subscribe(async parm => {
      if (parm.has('id')) {
        this.guiSwitch = 'Travel';
        this.travel = await this.db.GetTravel(parm.get('id'), this.auth.getUser());
        this.Filter();
        this.log.log(parm.get('id'));
        this.newItem = false;
      } else {
        this.guiSwitch = 'Travel';
        this.travel = NewTravel();
        this.newItem = true;
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
    if (this.newItem) {
      this.guiSwitch = 'login';
    } else {

    }

    await this.db.UpdateTravel(this.travel, this.auth.getUser());
    this.alert.show('Saved');
  }

  async onLoginSubmit() {
    if (!(await this.auth.validPassword(this.password))) {
      this.wrongUserNameOrPassword = true;
      return;
    }

    this.wrongUserNameOrPassword = false;


    const httpData = await http('https://eydsla.strumpur.net/NewTravel.php',
    {
      username: this.username,
      travel: this.travel,
      password: this.password
    });
    await this.db.AddOrUpdateUserSecure(httpData.user, true);
    await this.auth.login(this.username, this.password);
    await this.db.AddOrUpdateTravelSecure(httpData.travel, true);
    this.newItem = false;
    this.travel = await this.db.GetTravel(httpData.travel._id, this.auth.getUser());
    this.guiSwitch = 'Travel';
    this.alert.show('Saved');
  }
}
