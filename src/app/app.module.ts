import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NavComponent } from './component/nav-menu/nav-menu.component';
import { MainComponent } from './component/main/main.component';
import { TravelComponent } from './component/travel/travel.component';
import { AlertComponent } from './component/alert/alert.component';
import { TravelsComponent } from './component/travels/travels.component';
import { BuyItemComponent } from './component/buy-item/buy-item.component';
import { BuyItemsComponent } from './component/buy-items/buy-items.component';
import { SyncComponent } from './component/sync/sync.component';
import { DatetimePickerComponent } from './component/datetime-picker/datetime-picker.component';
import { PieComponent } from './component/graph/pie/pie.component';
import { TotalCategoryTableComponent } from './component/total-category-table/total-category-table.component';
import { LoginComponent } from './component/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AutoFocusDirective } from './directive/auto-focus.directive';

import {MatSelectModule} from '@angular/material/select';
import { ChangePasswordComponent } from './component/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MainComponent,
    TravelComponent,
    AlertComponent,
    TravelsComponent,
    BuyItemComponent,
    BuyItemsComponent,
    SyncComponent,
    DatetimePickerComponent,
    PieComponent,
    TotalCategoryTableComponent,
    LoginComponent,
    AutoFocusDirective,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ScrollingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
