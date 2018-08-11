import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  private timeoutHide;
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

  show(value:string, timeoutInSec: number = 15) {
    if (this.timeoutHide) {
      clearTimeout(this.timeoutHide);
      this.timeoutHide = null;
    }
    this.text = value;
    this.showing = true;
    if (!(timeoutInSec === null || timeoutInSec === undefined)) {
      this.timeoutHide = setTimeout(() => { this.hide(); }, timeoutInSec * 1000);
    }
  }

 }
