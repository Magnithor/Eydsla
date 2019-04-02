import { Component, OnInit, Input } from '@angular/core';
import { Travel } from '../../interface/travel';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../service/database.service';
import { MessageService, Message, MessageType } from '../../service/message.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../service/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavComponent implements OnInit {
  public collapse = true;
  public travels: Travel[];
  public _travelSelected: string;
  private subscription: Subscription;

  @Input('travelSelected')
  public set travelSelected(value: string) {
    console.log('set ' + value);
    this._travelSelected = value;
    this.db.AddOrUpdateSettingItem('SelectTravel', value);
  }

  public get travelSelected(): string {
    return this._travelSelected;
  }
  constructor(private db: DatabaseService,
    private messageService: MessageService,
    public router: Router,
    public authenticationService: AuthenticationService) {
    this.subscription = this.messageService.getMessage().subscribe(msg => this.OnMessage(msg));
    console.log(router);
   }

  async ngOnInit() {
    await this.reReload();
  }

  public showHide() {
    this.collapse = !this.collapse;
  }

  public hide() {
    this.collapse = true;
  }

  OnMessage(item: Message) {
    switch (item.type) {
      case MessageType.travel:
      case MessageType.sync:
        this.reReload();
      break;
    }
  }

  async reReload() {
    const travels = await this.db.GetTravels();
    travels.sort((a, b) => b.from.getTime() - a.from.getTime());
    this.travels = travels;
    this._travelSelected = await this.db.GetSettingItem('SelectTravel');
    if (this._travelSelected === null && travels.length > 0) {
      this.travelSelected = travels[0]._id;
    }
  }
}
