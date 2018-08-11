import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel';
import { Id, NewId, IdToString } from '../../interface/id';
import { BuyItem } from '../../interface/buy-item';

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.css']
})
export class TravelsComponent implements OnInit {

  data: Travel[];

  constructor(private db:DatabaseService) { }

  async ngOnInit() {
    const travels = await this.db.GetTravels();
    travels.sort((a,b)=>b.from.getTime()-a.from.getTime());
    this.data = travels;
    /*
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

   
    const buyitem: BuyItem = {
      id:IdToString(NewId(1)),
      caption:"bla",
      currency:"b",
      price:1,
      travelId:IdToString(id)
    }
    await this.db.AddOrUpdateBuyItem(buyitem);
*/
 
  }

}
