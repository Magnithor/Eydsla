import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { TravelComponent } from './component/travel/travel.component';
import { TravelsComponent } from './component/travels/travels.component';
import { SyncComponent } from './component/sync/sync.component';
import { BuyItemComponent } from './component/buy-item/buy-item.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'New', component: BuyItemComponent},
  { path: 'New/:travelId', component: BuyItemComponent},
  { path: 'EditBuyItem/:id', component: BuyItemComponent},
  { path: 'EditTravel/:id', component: TravelComponent},
  { path: 'EditTravel', component: TravelComponent},
  { path: 'Travels', component: TravelsComponent},
  { path: 'Sync', component: SyncComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
