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
  @ViewChild('dateInput') set setDateInput(content: ElementRef) {
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

  private _value: Date;
  private dateInput: ElementRef;
  private clockCanvas: ElementRef;

  @Input()
  set Value(value: Date) {
    this._value = value;
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.updateDateInput();
    this.renderDates();
  }
  @Output() ValueChange = new EventEmitter();

  get Value(): Date {
    return this._value;
  }

  public dateRow;
  public isPopupOpen = false;
  public inputHasError: boolean;
  public disapleUpdateDateInput = false;

  private monthName: string[] = ['Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí',
    'Júní', 'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember'];
  private monthNameShort: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Áug', 'Sep', 'Okt', 'Nov', 'Des'];
  private year: number;
  private month: number;
  private monthCaption: string;
  private timeState = true;
  private ca;
  public Math = Math;

  public showDay = true;
  public showMonth = false;
  public showYear = false;
  public showTime = true;
  constructor() {
    this.Value = new Date();
  }

  ngOnInit() { }
  ngAfterViewInit() { }

  public doShowMonth() {
    this.showDay = false;
    this.showMonth = true;
    this.showTime = false;
    this.showYear = false;
  }

  public doShowYear() {
    this.showDay = false;
    this.showMonth = false;
    this.showTime = false;
    this.showYear = true;
  }

  private updateValue(value: Date) {
    this._value = value;
    this.year = value.getFullYear();
    this.month = value.getMonth();
    this.updateDateInput();
    this.renderDates();
    this.ValueChange.emit(this._value);
    console.log('Update');
  }

  private updateDateInput() {
    if (this.disapleUpdateDateInput) { return; }
    if (this.dateInput) {
      const date = this.checkInput();
      const value = this.Value;
      if (date && value.getTime() === date.getTime()) { return; }
      this.dateInput.nativeElement.value =
          ('0' + (value.getMonth() + 1)).substr(-2) + '/'
        + ('0' + value.getDate()).substr(-2) + '/'
        + value.getFullYear() + ' '
        + ('0' + value.getHours()).substr(-2) + ':'
        + ('0' + value.getMinutes()).substr(-2);
    }
  }

  public checkParent(el: Node, tag: Node) {
    if (el === tag) {
      return true;
    }
    while (el && el.parentNode) {
        if (el === null) { return false; }
        el = el.parentNode;
        if (el === tag) {
            return true;
        }
    }
    return false;
  }

  public DateTimeFocusOut(event) {
    console.log(event);
    if (!event.relatedTarget || this.popupButton.nativeElement === event.relatedTarget) {
      return;
    }

    if (!this.checkParent(event.relatedTarget, this.popup.nativeElement)) {
      console.log(event);
      this.isPopupOpen = false;
    }
  }

  public togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
    if (this.isPopupOpen) {
      this.showDay = true;
      this.showMonth = false;
      this.showTime = true;
      this.showYear = false;
    }
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
  public monthClick(month) {
    this.month = month;
    this.renderDates();
    this.showDay = true;
    this.showMonth = false;
    this.showTime = true;
    this.showYear = false;
  }
  public yearClick(year) {
    this.year = year;
    this.doShowMonth();
  }

  private checkInput() {
    const value = this.dateInput.nativeElement.value;
    const arr = /^(\d\d?)[\/\. -]+(\d\d?)[\/\. -]+(\d\d(\d\d)?) +(\d\d?):(\d\d?)$/.exec(value);
    this.inputHasError = !arr;
    if (!arr) { return null; }
    let year: number;
    if (arr[4] === undefined) {
      year = 2000 + parseInt(arr[3], 10);
    } else {
      year = parseInt(arr[3], 10);
    }
    return new Date(year, parseInt(arr[1], 10) - 1, parseInt(arr[2], 10), parseInt(arr[5], 10), parseInt(arr[6], 10));
  }

  public EditInput() {
    const date = this.checkInput();
    if (date === null) { return; }

    this.disapleUpdateDateInput = true;
    try {
      this.updateValue(date);
    } finally {
      this.disapleUpdateDateInput = false;
    }
  }

  public timeBoxChangeHour(event) {
    let value = this.eh.nativeElement.value;
    if (value.length < 1 || isNaN(value) || value === '0' || value === '') {
      return;
    }

    if (parseInt(value, 10) > 23) {
      this.eh.nativeElement.value = value[0] + value[1];
      value = this.eh.nativeElement.value;
    }

    this.timeState = true;
    if (value === parseInt(value, 10)) {
      this.Value.setHours(value);
      this.updateValue(this.Value);
    }

    this.renderTime();
  }
  public timeBoxChangeMin(event) {
    let value = this.em.nativeElement.value;
    if (value.length < 1 || isNaN(value) || value === '0' || value === '') {
      return;
    }

    if (parseInt(value, 10) > 60) {
      this.em.nativeElement.value = value[0] + value[1];
      value = this.em.nativeElement.value;
    }

    this.timeState = false;
    if (value === parseInt(value, 10)) {
      this.Value.setMinutes(value);
      this.updateValue(this.Value);
    }

    this.renderTime();
  }
  public nextYear() {
    this.year++;
    this.renderDates();
  }
  public prevYear() {
    this.year--;
    this.renderDates();
  }

  public nextMonth() {
    const s = new Date(this.year, this.month, 1);
    s.setMonth(s.getMonth() + 1);
    this.year = s.getFullYear();
    this.month = s.getMonth();
    this.renderDates();
  }

  public prevMonth() {
    const s = new Date(this.year, this.month, 1);
    s.setMonth(s.getMonth() - 1);
    this.year = s.getFullYear();
    this.month = s.getMonth();
    this.renderDates();
  }
  private timeClick(e) {
    e = e || window.event;
    // stopPropagation(e);
    const target = e.target || e.srcElement;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    let a = ((Math.atan2(85 - offsetX, 85 - offsetY) * -180 / Math.PI));
    const d = Math.sqrt(Math.pow(85 - offsetX, 2) + Math.pow(85 - offsetY, 2));
    if (a < 0) {
      a = 360 + a;
    }
    a = a / 360;
    const h = Math.floor(((a + (1 / 24)) % 1) * 12);
    const m = Math.floor(a * 60);
    //  console.log(a, d, [h, m]);

    if (this.timeState) {

      if (32 < d && d < 55) {
        if (h === 0) {
          this.Value.setHours(12);
        } else {
          this.Value.setHours(h);
        }
      } else if (55 < d && d < 78) {
        if (h === 0) {
          this.Value.setHours(0);
        } else {
          this.Value.setHours(h + 12);
        }
      }

      this.updateValue(this.Value);
      this.timeState = false;
      this.renderTime();
    } else { // Min
      if (55 < d && d < 78) {
        this.Value.setMinutes(m);
        this.updateValue(this.Value);
      }

      this.renderTime();
    }
  }
  private renderHour(ca: CanvasRenderingContext2D, c: HTMLCanvasElement, s: number, r: number, eH: HTMLInputElement, eM: HTMLInputElement) {
    const h = this.Value.getHours(),
      m = this.Value.getMinutes();
    eH.value = h < 10 ? ('0' + h) : h.toString();
    eM.value = m < 10 ? ('0' + m) : m.toString();
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
    if (h === 0) {
      this.renderSelectTime(ca, s, 0 * ((Math.PI * 2) / 12), 67 * r, r);
    } else if (h > 12) {
      this.renderSelectTime(ca, s, (h - 12) * ((Math.PI * 2) / 12), 67 * r, r);
    } else {
      this.renderSelectTime(ca, s, h * ((Math.PI * 2) / 12), 44 * r, r);
    }

    this.renderNumberCircle(ca, s, 1, 0, 24, 67 * r, 12);
    this.renderNumberCircle(ca, s, 1, 12, 12, 44 * r, null);
  }
  private renderNumberCircle(ca: CanvasRenderingContext2D, s: number, inc: number, i: number, mod: number, r: number, firstAdd: number) {
    let a = 0;
    let first = true;
    while (a < 2 * Math.PI) {
      ca.fillText(i.toString(), s + r * Math.cos(a - 0.5 * Math.PI), s + r * Math.sin(a - 0.5 * Math.PI));
      a = a + (Math.PI * 2) / 12;
      if (first && firstAdd) {
        i += firstAdd;
        first = false;
      }
      i = (i % mod) + inc;
    }
  }
  private renderMin(ca: CanvasRenderingContext2D, c: HTMLCanvasElement, s: number, r: number, eH: HTMLInputElement, eM: HTMLInputElement) {
    const h = this.Value.getHours(),
      m = this.Value.getMinutes();
    eH.value = h < 10 ? ('0' + h) : h.toString();
    eM.value = m < 10 ? ('0' + m) : m.toString();
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

    this.renderNumberCircle(ca, s, 5, 60, 60, 67 * r, null);
  }
  private renderSelectTime(ca, s, i, r, h) {
    const x = s + r * Math.cos(i - 0.5 * Math.PI);
    const y = s + r * Math.sin(i - 0.5 * Math.PI);
    ca.save();
    ca.fillStyle = '#90D1F1';
    ca.strokeStyle = '#A5D9F3';

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
    const c: HTMLCanvasElement = this.clockCanvas.nativeElement;
    const ca = c.getContext('2d');
    const r = window.devicePixelRatio || 1;
    let s = 170;
    c.height = s * r;
    c.width = s * r;
    c.style.width = s + 'px';
    c.style.height = s + 'px';
    s = s * r * 0.5;
    if (this.timeState) {
      this.renderHour(ca, c, s, r, this.eh.nativeElement, this.em.nativeElement);
    } else {
      this.renderMin(ca, c, s, r, this.eh.nativeElement, this.em.nativeElement);
    }
  }
  private renderDates() {
    const v = [];
    const s = new Date(this.year, this.month, 1);
    this.monthCaption = this.monthName[this.month] + ', ' + this.year;
    s.setDate(s.getDate() - s.getDay());
    for (let w = 0; w < 6; w++) {
      const week = { days: [] };
      v.push(week);
      for (let i = 0; i < 7; i++) {
        week.days.push({
          d: s.getDate(), s: new Date(s.getTime()),
          c: (s.getMonth() === this.month ? 'DateTimePickerDay' : 'DateTimePickerPastDay') +
            ((s.getFullYear() === this.Value.getFullYear() && s.getMonth() === this.Value.getMonth() &&
              s.getDate() === this.Value.getDate()) ?
              ' DateTimePickerSelectedDate' : ' DateTimePickerSelect')
        });
        s.setDate(s.getDate() + 1);
      }
    }
    this.dateRow = v;
  }
}
