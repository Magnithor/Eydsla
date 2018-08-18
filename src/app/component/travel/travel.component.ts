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

  @ViewChild('alert') alert: AlertComponent;
  @ViewChild('myForm') myForm;
 

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
  }

  UpdateDate(value) : Date {
    return new Date(value);
  }

  AddCategory() {
    this.travel.category.push( {id: this.travel.categoryMaxId, name:'', color:"red" });
    this.travel.categoryMaxId++;
  }

  ngOnInit() {
    this.travel = NewTravel(1);      
  }

  async onSave() {
    
   await this.db.AddOrUpdateTravel(this.travel); 
   this.alert.show("Saved");
  }

}
