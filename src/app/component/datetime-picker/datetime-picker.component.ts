import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { viewDef } from '@angular/core/src/view';


@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.css']
})
export class DatetimePickerComponent implements OnInit, AfterViewInit {
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('popupButton') popupButton: ElementRef;
  @ViewChild('dateInput') set setDateInput(content: ElementRef){
    this.dateInput = content;
    this.updateDateInput();
  } 
  @ViewChild('eh') eh: ElementRef;
  @ViewChild('em') em: ElementRef;
  @ViewChild('clockCanvas') set content(conent: ElementRef) {
    this.clockCanvas = conent;
    if (conent) {
      this.renderTime();
    }
  }

  private _value: Date
  private dateInput:ElementRef;
  private clockCanvas: ElementRef;

  @Input()
  set Value(value: Date) {
    this._value = value;
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.updateDateInput();
    this.renderDates();
  };
  @Output() ValueChange = new EventEmitter();

  get Value(): Date {
    return this._value;
  }


  public dateRow;
  public isPopupOpen: Boolean = false;
  public inputHasError: boolean;
  public disapleUpdateDateInput: boolean = false;

  private monthName: string[] = ["Janúar", "Febrúar", "Mars", "Apríl", "Maí",
    "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember"];
  private year: number;
  private month: number;
  private monthCaption: string;
  private timeState: boolean = true;
  private ca;
  constructor() {
    this.Value = new Date();
  }

  ngOnInit() { }
  ngAfterViewInit() { }

  private updateValue(value:Date){
    this._value = value;
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.updateDateInput();
    this.renderDates();
    this.ValueChange.emit(this._value);
    console.log("Update");
  }
  
  private updateDateInput() {    
    if (this.disapleUpdateDateInput) { return;}
    if (this.dateInput) {
      const date = this.checkInput();
      const value = this.Value;
      if (date && value.getTime() === date.getTime()) { return; }
      this.dateInput.nativeElement.value = 
          ("0" + (value.getMonth()+1)).substr(-2) + "/"
        + ("0" + value.getDate()).substr(-2) + "/"
        + value.getFullYear() + " "
        + ("0" + value.getHours()).substr(-2) + ":"
        + ("0" + value.getMinutes()).substr(-2);
    }
  }

  public checkParent(el, tag) {
    if (el === tag) {
      return true;
    }
    while (el && el.parentNode) {
        if (el == null) { return false; }
        el = el.parentNode;
        if (el === tag)
            return true;
    }
    return false;
}

  public DateTimeFocusOut(event) {
    console.log(event);
    if (!event.relatedTarget || this.popupButton.nativeElement == event.relatedTarget){
      return;
    }
    
    if (!this.checkParent(event.relatedTarget, this.popup.nativeElement)) {
      console.log(event);
      this.isPopupOpen = false;
      }
  }

  public togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
  }
  

  public changeTimeState(value: boolean) {
    this.timeState = value;
    this.renderTime();
  }
  public SetDate(value: Date) {
    value.setHours(this.Value.getHours());
    value.setMinutes(this.Value.getMinutes());
    this.updateValue(value);
    this.isPopupOpen = false;
  }

  private checkInput() {
    var value = this.dateInput.nativeElement.value;
    var arr = /^(\d\d?)[\/\. -]+(\d\d?)[\/\. -]+(\d\d(\d\d)?) +(\d\d?):(\d\d?)$/.exec(value);
    this.inputHasError = !arr;
    if (!arr) {return null;}
    let year:number;
    if (arr[4] == undefined) {
      year = 2000+ parseInt(arr[3]);
    } else {
      year = parseInt(arr[3]);
    }
    return new Date(year, parseInt(arr[1])-1, parseInt(arr[2]), parseInt(arr[5]), parseInt(arr[6]))
  }
  
  public EditInput() {
    var date = this.checkInput();
    console.log(date);

    this.disapleUpdateDateInput = true;
    try {
      this.updateValue(date);
    } finally {
      this.disapleUpdateDateInput = false;
    }
  }

  public timeBoxChangeHour(event) {
    let value = this.eh.nativeElement.value;
    if (value.length < 1 || isNaN(value) || value === "0" || value === "") {
      return;
    }

    if (parseInt(value, 10) > 23) {
      this.eh.nativeElement.value = value[0] + value[1];
      value = this.eh.nativeElement.value;
    }

    this.timeState = true;
    if (value == parseInt(value, 10)) {
      this.Value.setHours(value);
      this.updateValue(this.Value);
    }

    this.renderTime();
  }
  public timeBoxChangeMin(event) {
    let value = this.em.nativeElement.value;
    if (value.length < 1 || isNaN(value) || value === "0" || value === "") {
      return;
    }

    if (parseInt(value, 10) > 60) {
      this.em.nativeElement.value = value[0] + value[1];
      value = this.em.nativeElement.value;
    }

    this.timeState = false;
    if (value == parseInt(value, 10)) {
      this.Value.setMinutes(value);
      this.updateValue(this.Value);
    }

    this.renderTime();
  }

  public nextMonth() {
    let s = new Date(this.year, this.month, 1);
    s.setMonth(s.getMonth() + 1);
    this.year = s.getFullYear();
    this.month = s.getMonth();
    this.renderDates();
  }

  public prevMonth() {
    let s = new Date(this.year, this.month, 1);
    s.setMonth(s.getMonth() - 1);
    this.year = s.getFullYear();
    this.month = s.getMonth();
    this.renderDates();
  }
  private timeClick(e) {
    e = e || window.event;
    //stopPropagation(e);
    var target = e.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = e.clientX - rect.left,
      offsetY = e.clientY - rect.top,
      d = Math.sqrt(Math.pow(85 - offsetX, 2) + Math.pow(85 - offsetY, 2)),
      a = ((Math.atan2(85 - offsetX, 85 - offsetY) * -180 / Math.PI)),
      h,
      m;
    if (a < 0) {
      a = 360 + a;
    }
    a = a / 360;
    h = Math.floor(((a + (1 / 24)) % 1) * 12);
    m = Math.floor(a * 60);
    //  console.log(a, d, [h, m]);

    if (this.timeState) {

      if (32 < d && d < 55) {
        if (h == 0) {
          this.Value.setHours(12);
        } else {
          this.Value.setHours(h);
        }
      } else if (55 < d && d < 78) {
        if (h == 0) {
          this.Value.setHours(0);
        } else {
          this.Value.setHours(h + 12);
        }
      }

      this.updateValue(this.Value);
      this.timeState = false;
      this.renderTime();
    } else { //Min
      if (55 < d && d < 78) {
        this.Value.setMinutes(m);
        this.updateValue(this.Value);
      }

      this.renderTime();
    }
  }
  private renderHour = function (ca, c, s, r, eH, eM) {
    var h = this.Value.getHours(),
      m = this.Value.getMinutes();
    eH.value = h < 10 ? ("0" + h) : h;
    eM.value = m < 10 ? ("0" + m) : m;
    eH.focus();
    ca.clearRect(0, 0, c.width, c.height);
    ca.beginPath();
    ca.arc(s, s, s * 0.95, 0, 2 * Math.PI, false);
    ca.fillStyle = '#F8F8F8';
    ca.fill();
    ca.lineWidth = 1 * r;
    ca.strokeStyle = '#D1D1D1';
    ca.stroke();

    ca.fillStyle = '#202020';
    ca.font = (12 * r) + 'pt Calibri';
    ca.textAlign = 'center';
    ca.textBaseline = 'middle';
    ca.fillRect(s - 1, s - 1, 2, 2);
    if (h == 0) {
      this.renderSelectTime(ca, s, 0 * ((Math.PI * 2) / 12), 67 * r, r);
    } else if (h > 12) {
      this.renderSelectTime(ca, s, (h - 12) * ((Math.PI * 2) / 12), 67 * r, r);
    } else {
      this.renderSelectTime(ca, s, h * ((Math.PI * 2) / 12), 44 * r, r);
    }

    this.renderNumberCircle(ca, s, 1, 0, 24, 67 * r, 12);
    this.renderNumberCircle(ca, s, 1, 12, 12, 44 * r);
  }
  private renderNumberCircle = function (ca, s, inc, i, mod, r, firstAdd) {
    var a, i, m, first = true;
    a = 0;
    while (a < 2 * Math.PI) {
      ca.fillText(i, s + r * Math.cos(a - 0.5 * Math.PI), s + r * Math.sin(a - 0.5 * Math.PI));
      a = a + (Math.PI * 2) / 12;
      if (first && firstAdd) {
        i += firstAdd;
        first = false;
      }
      i = (i % mod) + inc;
    }
  }
  private renderMin = function (ca:CanvasRenderingContext2D, c, s:number, r:number, eH:HTMLInputElement, eM:HTMLInputElement) {
    var h = this.Value.getHours(),
      m = this.Value.getMinutes();
    eH.value = h < 10 ? ("0" + h) : h;
    eM.value = m < 10 ? ("0" + m) : m;
    eM.focus();
    ca.clearRect(0, 0, c.width, c.height);
    ca.beginPath();
    ca.arc(s, s, s * 0.95, 0, 2 * Math.PI, false);
    ca.fillStyle = '#F8F8F8';
    ca.fill();
    ca.lineWidth = 1 * r;
    ca.strokeStyle = '#D1D1D1';
    ca.stroke();

    ca.fillStyle = '#202020';
    ca.font = (12 * r) + 'pt Calibri';
    ca.textAlign = 'center';
    ca.textBaseline = 'middle';
    ca.fillRect(s - 1, s - 1, 2, 2);

    this.renderSelectTime(ca, s, m * ((Math.PI * 2) / 60), 67 * r, r);

    this.renderNumberCircle(ca, s, 5, 60, 60, 67 * r);

    /*if (this.updateDateOnSelect) {
        setInput.call(this, {}, this.selectDate, false);
    }*/
  }
  renderSelectTime = function (ca, s, i, r, h) {
    var x = s + r * Math.cos(i - 0.5 * Math.PI), y = s + r * Math.sin(i - 0.5 * Math.PI);
    ca.save();
    ca.fillStyle = "#90D1F1";
    ca.strokeStyle = "#A5D9F3";

    ca.beginPath();
    ca.moveTo(s, s);
    ca.lineTo(x, y);
    ca.stroke();

    ca.beginPath();
    ca.arc(x, y, 11 * h, 0, 2 * Math.PI, false);
    ca.fill();
    ca.restore();
  }
  private renderTime() {
    let c = this.clockCanvas.nativeElement;
    let ca = c.getContext("2d");
    let d = window.devicePixelRatio || 1;
    let b = ca.webkitBackingStorePixelRatio ||
      ca.mozBackingStorePixelRatio ||
      ca.msBackingStorePixelRatio ||
      ca.oBackingStorePixelRatio ||
      ca.backingStorePixelRatio || 1;
    let r = d / b;
    let s = 170;
    c.height = s * r;
    c.width = s * r;
    c.style.width = s + "px";
    c.style.height = s + "px";
    s = s*r *0.5;
    if (this.timeState) {
      this.renderHour(ca, c, s, r, this.eh.nativeElement, this.em.nativeElement);
    } else {
      this.renderMin(ca, c, s, r, this.eh.nativeElement, this.em.nativeElement);
    }
  }
  private renderDates() {
    let v = [];
    let s = new Date(this.year, this.month, 1);
    this.monthCaption = this.monthName[this.month] + ", " + this.year;
    s.setDate(s.getDate() - s.getDay());
    for (let w = 0; w < 6; w++) {
      let week = { days: [] };
      v.push(week);
      for (let i = 0; i < 7; i++) {
        week.days.push({
          d: s.getDate(), s: new Date(s.getTime()),
          c: (s.getMonth() == this.month ? "DateTimePickerDay" : "DateTimePickerPastDay") +
            ((s.getFullYear() === this.Value.getFullYear() && s.getMonth() === this.Value.getMonth() && s.getDate() === this.Value.getDate()) ?
              " DateTimePickerSelectedDate" : " DateTimePickerSelect")
        });


        s.setDate(s.getDate() + 1);
      }
    }

    this.dateRow = v;
  }

}