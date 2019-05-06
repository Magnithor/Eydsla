import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { TravelComponent } from './component/travel/travel.component';
import { TravelsComponent } from './component/travels/travels.component';
import { SyncComponent } from './component/sync/sync.component';
import { BuyItemComponent } from './component/buy-item/buy-item.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './authGuard';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { CreateUserComponent } from './component/create-user/create-user.component';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'Login', component: LoginComponent},
  { path: 'ChangePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  { path: 'CreateUser', component: CreateUserComponent, canActivate: [AuthGuard]},
  { path: 'New', component: BuyItemComponent, canActivate: [AuthGuard]},
  { path: 'New/:travelId', component: BuyItemComponent, canActivate: [AuthGuard]},
  { path: 'EditBuyItem/:id', component: BuyItemComponent, canActivate: [AuthGuard]},
  { path: 'EditTravel/:id', component: TravelComponent, canActivate: [AuthGuard]},
  { path: 'EditTravel', component: TravelComponent, canActivate: [AuthGuard]},
  { path: 'Travels', component: TravelsComponent, canActivate: [AuthGuard]},
  { path: 'Sync', component: SyncComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
