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

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    MainComponent,
    TravelComponent,
    AlertComponent
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
