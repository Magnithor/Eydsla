import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../service/sync.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {

  constructor(private sync: SyncService) { }

  ngOnInit() {
  }

  doSync(){
    this.sync.syncData();
  }
}
