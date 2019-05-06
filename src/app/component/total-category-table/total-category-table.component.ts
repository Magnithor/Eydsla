import { Component, Input, ElementRef } from '@angular/core';
import { DatabaseService } from '../../service/database.service';
import { TravelCategory, Travel } from '../../interface/travel';
import { BuyItem } from 'src/app/interface/buy-item';
import { calcISK } from 'src/app/static/calcISK';
import { getAfterDot, getThousundDot } from 'src/app/static/numbers';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-total-category-table',
  templateUrl: './total-category-table.component.html',
  styleUrls: ['./total-category-table.component.css']
})
export class TotalCategoryTableComponent {

  @Input()
  set travelId(value: string) {
    this._travelId = value;
    this.getTravelId(value);
  }

  public _travelId: string;
  public data: {[category: string]: {total: number, category: string}};
  public total = 0;
  public Math = Math;
  public travel: Travel;


  constructor(private auth: AuthenticationService, private db: DatabaseService) { }
  getAfterDot(value: number) {
    return getAfterDot(value);
  }

  getThousundDot(value: number) {
    return getThousundDot(value);
  }

  calcISK(value: BuyItem): number {
    return calcISK(value, this.travel);
  }

  async getTravelId(id) {
    if (!id || id === '') {
      return;
    }

    this.travel = await this.db.GetTravel(id, this.auth.getUser());
    const data = await this.db.GetBuyItemByTravelId(id, this.auth.getUser());
    const result = {};
    let cat;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].category === null || data[i].category === undefined) {
        cat = '??';
      } else {
        cat = data[i].category;
      }
      const price = this.calcISK(data[i]);

      if (result[cat] === undefined) {
        result[cat] = {total: 0, category: this.getNameFromCategories(this.travel.categories, cat)};
      }

      result[cat].total += price;
      total += price;
    }

    this.total = total;
    this.data = result;
  }

  getNameFromCategories(categories: TravelCategory[], cat) {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === cat) {
        return categories[i].name;
      }
    }

    return '??';
  }
}
