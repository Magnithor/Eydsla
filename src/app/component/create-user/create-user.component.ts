import { Component, OnInit } from '@angular/core';
import { Travel } from 'src/app/interface/travel';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DatabaseService } from 'src/app/service/database.service';

interface TravelCheck extends Travel {
  checked: boolean;
}
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  travels: TravelCheck[];
  public username: string;
  public password: string;
  public wrongUserNameOrPassword: boolean;
  public newUsername: string;
  public newPassword1: string;
  public newPassword2: string;
  public newPasswordNotSame: boolean;
  public unableToCreateUser: boolean;

  constructor(private auth: AuthenticationService, private db: DatabaseService) {
    this.username = auth.getUser().username;
    this.wrongUserNameOrPassword = false;
    this.newPasswordNotSame = false;
    this.unableToCreateUser = false;
  }

  async ngOnInit() {
    const travels = <TravelCheck[]>await this.db.GetTravels(this.auth.getUser());
    travels.sort((a, b) => b.from.getTime() - a.from.getTime());
    travels.forEach(item => {
      item.checked = true;
    });
    this.travels = travels;
  }

  async createUser() {
    if (this.newPassword1 !== this.newPassword2) {
      this.newPasswordNotSame = true;
    }

    if (!(await this.auth.validPassword(this.password))) {
      this.wrongUserNameOrPassword = true;
    }

    if (this.newPasswordNotSame || this.wrongUserNameOrPassword) {
      return;
    }

    this.newPasswordNotSame = false;
    this.wrongUserNameOrPassword = false;

    const grantTravels: {[index: string]: string} = {};
    const user = this.auth.getUser();
    this.travels.forEach(item => {
      if (item.checked) {
        grantTravels[item._id] = user.data.travels[item._id].key;
      }
    });

    if (!(await this.auth.createUser(this.password, this.newUsername, this.newPassword1, grantTravels))) {
      this.unableToCreateUser = true;
      return;
    }

    this.unableToCreateUser = false;
  }
}
