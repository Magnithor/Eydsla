import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('pass') el: any;
  loading = false;
  submitted = false;
  returnUrl: string;
  wrongUserNameOrPassword:boolean = false;

  
  constructor(private route: ActivatedRoute, private router: Router, private authentication:AuthenticationService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onSubmit() {
    var ok = await this.authentication.login("magni","0077");
    if (!ok) { this.wrongUserNameOrPassword  = true;} else {
      this.router.navigate([this.returnUrl]);

    }
    // var encrypted = this.set('0077', '{"T":"Rettpass"}');
 
  }
}
