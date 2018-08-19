import { Component, OnInit, ViewChild } from '@angular/core';
import { BuyItem, NewBuyItem } from '../../interface/buy-item';
import { Travel } from '../../interface/travel';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../service/logger.service';
import { DatabaseService } from '../../service/database.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-buy-item',
  templateUrl: './buy-item.component.html',
  styleUrls: ['./buy-item.component.css']
})
export class BuyItemComponent implements OnInit {
  @ViewChild('alert') alert: AlertComponent;

  public buyItem: BuyItem;
  public travel: Travel;

  constructor(private route: ActivatedRoute, private log: LoggerService, private db: DatabaseService) { 
    this.route.paramMap.subscribe(async parm => { 
      if (parm.has("id")) {
        this.buyItem = await this.db.GetBuyItemById(parm.get('id'));
        this.travel = await this.db.GetTravel(this.buyItem.travelId);
        this.log.warn(parm.get("id")); }
      else {
        if (parm.has("travelId")){
          this.buyItem = NewBuyItem(parm.get("travelId"), 1);
          this.travel = await this.db.GetTravel(this.buyItem.travelId);
        } else {
          let travelId = await this.db.GetSettingItem('SelectTravel');
          this.travel = await this.db.GetTravel(travelId);
          this.buyItem = NewBuyItem(travelId, 1);
        }
      }
    });
  }

  ngOnInit() {
    this.buyItem = NewBuyItem("1", 1);
  }

  async onSave() {    
    await this.db.AddOrUpdateBuyItem(this.buyItem); 
    this.alert.show("Saved");
  }
 
}