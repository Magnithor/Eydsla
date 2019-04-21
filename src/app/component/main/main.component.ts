import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel';
import { Subscription } from 'rxjs';
import { MessageService, Message, MessageType } from '../../service/message.service';
import { AuthenticationService } from 'src/app/service/authentication.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private subscription: Subscription;
  public travelSelected: string;
  public travel: Travel;
  public showPie = false;
  public showTotal = false;
  public hasTravel = true;
  constructor(private auth: AuthenticationService, private db: DatabaseService, private messageService: MessageService ) {
    this.subscription = this.messageService.getMessage().subscribe(msg => this.OnMessage(msg));
  }

  async ngOnInit() {
    await this.update();
  }

  async update() {
    this.hasTravel = true;
    this.travelSelected = await this.db.GetSettingItem('SelectTravel');
    if (this.travelSelected) {
      this.travel = await this.db.GetTravel(this.travelSelected, this.auth.getUser());
    } else {
      this.hasTravel = false;
    }
  }

  async OnMessage(item: Message) {
    switch (item.type) {
      case MessageType.setting:
        if (item.key === 'SelectTravel') {
          await this.update();
        }
      break;
    }
  }
}
