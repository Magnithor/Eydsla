import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public username: string;
  public password: string;
  public wrongUserNameOrPassword: boolean;
  public newPassword1: string;
  public newPassword2: string;
  public newPasswordNotSame: boolean;
  public unableToChangePassword: boolean;
  constructor(private auth: AuthenticationService) {
    this.username = auth.getUser().username;
    this.wrongUserNameOrPassword = false;
    this.newPasswordNotSame = false;
    this.unableToChangePassword = false;
   }

  ngOnInit() {
  }

  async doChangePassword() {
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

    if (!(await this.auth.changePassword(this.password, this.newPassword1))){
      this.unableToChangePassword = true;
      return;
    }
    this.unableToChangePassword = false;
  }

}
