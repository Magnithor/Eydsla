import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public travelSelected: string;
  constructor(private db:DatabaseService) { }


  async ngOnInit() {
    this.travelSelected = await this.db.GetSettingItem('SelectTravel');
  }

}
