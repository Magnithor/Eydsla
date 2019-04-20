import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Encryption} from './../../static/encryption';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { MessageService, MessageType } from 'src/app/service/message.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('user') user: any;
  @ViewChild('pass') pass: any;
  loading = false;
  submitted = false;
  returnUrl: string;
  wrongUserNameOrPassword = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private authentication: AuthenticationService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  enterOnUser() {
    this.pass.nativeElement.focus();
    return false;
  }
  async onSubmit() {
    let user = this.user.nativeElement.value;
    let pass = this.pass.nativeElement.value;
    if (user === '') { user = 'magni'; }
    if (pass === '') { pass = '0077'; }

    const ok = await this.authentication.login(user, pass);

    if (!ok) {
      this.wrongUserNameOrPassword  = true;
    } else {
      this.messageService.sendMessage({type: MessageType.authenticate});
      this.router.navigate([this.returnUrl]);
    }
  }
}
