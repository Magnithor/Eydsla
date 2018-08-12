import { Component, OnInit, Input } from '@angular/core';
import { Travel } from '../../interface/travel';
import { DatabaseService } from '../../service/database.service';
import { TravelComponent } from '../travel/travel.component';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavComponent implements OnInit {
  public collapse = true;
  public travels: Travel[];
  public _travelSelected: string;
  @Input('travelSelected')
  public set travelSelected(value: string) {
    console.log('set ' + value);
    this._travelSelected = value;
    this.db.AddOrUpdateSettingItem('SelectTravel', value);
  }
  public get travelSelected():string {
 //   console.log('get');
    return this._travelSelected;
  }
  constructor(private db:DatabaseService) { }

  async ngOnInit() {
    this._travelSelected = await this.db.GetSettingItem('SelectTravel');
    const travels = await this.db.GetTravels();
    travels.sort((a,b)=>b.from.getTime()-a.from.getTime());
    this.travels = travels;
    if (this._travelSelected === null && travels.length > 0) {
      this.travelSelected = travels[0]._id;      
    }
  }

  public showHide() {
    this.collapse = !this.collapse;
  }

  public hide() {
    this.collapse = true;
  }
}
