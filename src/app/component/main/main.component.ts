import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel'
import { Subscription } from 'rxjs';
import { MessageService, Message, MessageType } from '../../service/message.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private subscription: Subscription;
  public travelSelected: string;
  public travel: Travel;
  constructor( private db:DatabaseService, private messageService:MessageService ) {
    this.subscription = this.messageService.getMessage().subscribe(msg => this.OnMessage(msg));

  }


  async ngOnInit() {
    await this.update();
  }

  async update(){
    this.travelSelected = await this.db.GetSettingItem('SelectTravel');
    this.travel = await this.db.GetTravel(this.travelSelected);
  }

  async OnMessage(item: Message){
    switch(item.type) {
      case MessageType.setting:
        if(item.key === "SelectTravel"){
          await this.update();
        }
      break;
    }

  }

}
