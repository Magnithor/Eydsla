import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from '../../../service/database.service';
import { TravelCategory } from '../../../interface/travel';
import { updateConvasSize } from '../../../static/canvas';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent {

  @Input()
  set travelId(value: string) {
    this._travelId = value;
    if (value === null || value === undefined) {
      return;
    }
    this.getTravelId(value);
  }
  @ViewChild('canvas') set setCanvas(conent: ElementRef) {
    if (conent) {
      this.canvas = conent.nativeElement;
      this.render();
    }
  }

  public canvas: HTMLCanvasElement;
  public _travelId: string;
  public data: {total: number, data: any};

  constructor(private auth:AuthenticationService, private db: DatabaseService) { }

  public render() {
    const ctx = this.canvas.getContext('2d');

    const r = updateConvasSize(this.canvas, 200, 200);
    const w = this.canvas.width;
    const h = this.canvas.height;
    const w2 = w * 0.5;

    ctx.clearRect(0, 0, w, h);
    if (!this.data) {
      return;
    }
    ctx.beginPath();
    ctx.arc(w2, w2, w2 * 0.95, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#F8F8F8';
    ctx.fill();
    ctx.lineWidth = 1 * r;
    ctx.strokeStyle = '#D1D1D1';
    ctx.stroke();

    let first = false;
    let r1 = 0;
    for (const i in this.data.data) {
      if (!this.data.data.hasOwnProperty(i)) { continue; }
      const r2 = r1 + (this.data.data[i].t / this.data.total);
      ctx.beginPath();
      ctx.moveTo(w2, w2);
      ctx.arc(w2, w2, w2 * 0.95, r1 * 2 * Math.PI, r2 * 2 * Math.PI, false);
      ctx.lineTo(w2, w2);
      ctx.fillStyle = this.data.data[i].c;

      ctx.fill();
      r1 = r2;
      first = true;
    }
  }

  async getTravelId(id) {
    const travel = await this.db.GetTravel(id, this.auth.getUser());
    const data = await this.db.GetBuyItemByTravelId(id);
    const result = {};
    let cat;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].category === null || data[i].category === undefined) {
        cat = '??';
      } else {
        cat = data[i].category;
      }

      if (result[cat] === undefined) {
        result[cat] = {t: 0, c: this.getColorFromCategories(travel.categories, cat)};
      }

      result[cat].t += data[i].price;
      total += data[i].price;
    }

    this.data = {total: total, data: result};
    this.render();
  }

  getColorFromCategories(categories: TravelCategory[], cat) {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === cat) {
        return categories[i].color;
      }
    }

    return 'red';
  }
}
