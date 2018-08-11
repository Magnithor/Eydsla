import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { TravelComponent } from './component/travel/travel.component';
import { TravelsComponent } from './component/travels/travels.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'EditTravel/:id', component: TravelComponent},
  { path: 'EditTravel', component: TravelComponent},
  { path: 'Travels', component: TravelsComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
