import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Travel, NewTravel } from '../../interface/travel';
import { LoggerService } from '../../service/logger.service';
import { DatabaseService } from '../../service/database.service';
import { switchMap } from 'rxjs/operators';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.css']
})
export class TravelComponent implements OnInit {

  @ViewChild('alertSuccess') alertSuccess: AlertComponent;

  public travel: Travel;
  constructor(private route: ActivatedRoute, private log: LoggerService, private db: DatabaseService) { 
    //this.travel = 
    this.route.paramMap.subscribe(async parm => { 
      if (parm.has("id")) {
        this.travel = await this.db.GetTravel(parm.get('id'));
      this.log.warn(parm.get("id")); }
      else {
        this.travel = NewTravel(1);
      }
    });
    /*
    pipe(
      switchMap((params: ParamMap) => {
        NewTravel( parseInt(params.get('id'))) 
       
      }
      )
       //this.service.getHero(params.get('id')))
    );*/
     //= NewTravel(1);
  }

  ngOnInit() {
    this.travel = NewTravel(1);
    let v = this;
    setInterval(function(){console.log(v.travel.from.getDate());},10*1000);
  }

  async onSave() {
   await this.db.AddOrUpdateTravel(this.travel); 
   this.alertSuccess.text= "OK";
   this.alertSuccess.show("test");
  }

}
