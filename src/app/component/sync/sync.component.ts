import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../service/sync.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {

  syncPercent:number = 0;
  constructor(private sync: SyncService) { }

  ngOnInit() {
  }

  doSync(){
    this.sync.syncData((value,max)=> {
      this.syncPercent = (value / max) * 100;
      console.log(this.syncPercent + " " + value + " " + max);
    });
  }
}
