import { Component, OnInit, ViewChild } from '@angular/core';
import { SyncService } from '../../service/sync.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {
  @ViewChild('alert') alert: AlertComponent;
  public username: string;
  public password: string;
  public wrongUserNameOrPassword: boolean;

  syncPercent = 0;
  constructor(
    private auth: AuthenticationService,
    private sync: SyncService) {
      this.username = auth.getUser().username;
      this.wrongUserNameOrPassword = false;
    }

  ngOnInit() {
  }

  async doSync() {

    if (!(await this.auth.validPassword(this.password))) {
      this.wrongUserNameOrPassword = true;
      return;
    }

    this.wrongUserNameOrPassword = false;

    this.sync.syncData(this.username, this.password, (value, max) => {
      this.syncPercent = (value / max) * 100;
      // console.log(this.syncPercent + " " + value + " " + max);
    });
  }
}
