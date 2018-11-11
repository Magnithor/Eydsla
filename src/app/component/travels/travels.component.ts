import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { Travel } from '../../interface/travel';

@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.css']
})
export class TravelsComponent implements OnInit {

  data: Travel[];

  constructor(private db: DatabaseService) { }

  async ngOnInit() {
    const travels = await this.db.GetTravels();
    travels.sort((a, b) => b.from.getTime() - a.from.getTime());
    this.data = travels;
  }
}
