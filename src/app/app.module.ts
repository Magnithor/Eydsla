import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    SyncComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
