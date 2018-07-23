import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel';
import { Id, NewId, IdToString } from '../../interface/id';
import { BuyItem } from '../../interface/buy-item';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private db:DatabaseService) { }

  data: Travel[];

  async ngOnInit() {
    let travel: Travel = {
      from:new Date,
      to:new Date,
      name: "Test",
      id: IdToString(NewId(1))
    };

    console.log( IdToString(travel.id) );
    await this.db.AddOrUpdateTravel(travel);

    let id: Id = {userId: 1, rand:[0.4348717525001695, 0.700382968206019, 0.1966443006099028, 0.46842885556193603, 0.3633012715609174]};

    let d = await this.db.GetTravel(id);
    console.log(d);

    this.data = await this.db.GetTravels();

    const buyitem: BuyItem = {
      id:IdToString(NewId(1)),
      caption:"bla",
      currency:"b",
      price:1,
      travelId:IdToString(id)
    }
    await this.db.AddOrUpdateBuyItem(buyitem);

  }

}
