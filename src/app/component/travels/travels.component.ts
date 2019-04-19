import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.css']
})
export class TravelsComponent implements OnInit {

  data: Travel[];

  constructor(private auth: AuthenticationService, private db: DatabaseService) { }

  async ngOnInit() {
    const travels = await this.db.GetTravels(this.auth.getUser());
    travels.sort((a, b) => b.from.getTime() - a.from.getTime());
    this.data = travels;
  }
}
