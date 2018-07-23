import { Component, OnInit, Input } from '@angular/core';
import { Travel } from '../../interface/travel';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavComponent implements OnInit {

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
  constructor(private db:DatabaseService ) { }

  async ngOnInit() {
    this._travelSelected = await this.db.GetSettingItem('SelectTravel');
    this.travels = await this.db.GetTravels();
  }

}
