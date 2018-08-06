import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  private _text = 'bla';
  private showing = false;
  private showCloseBtn = true;
 
  @Input()
  set text(value: string) {
    this._text = value;
  }
 
  get text(): string { 
    return this._text; 
  }

  constructor() { }

  hide(){
    this.showing = false;
  }
  show(value:string) {
    this.text = value;
    this.showing = true;
   // setTimeout(() => { this.hide()}, 5000);
  }

 }
