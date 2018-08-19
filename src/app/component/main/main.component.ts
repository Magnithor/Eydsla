import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public travelSelected: string;
  public travel: Travel;
  constructor(private db:DatabaseService) { }


  async ngOnInit() {
    this.travelSelected = await this.db.GetSettingItem('SelectTravel');
    this.travel = await this.db.GetTravel(this.travelSelected);
  }

}
