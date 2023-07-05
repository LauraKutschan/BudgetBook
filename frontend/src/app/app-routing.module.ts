import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewComponent} from "./components/overview/overview.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {MapComponent} from "./components/map/map.component";
import {UploadComponent} from "./components/upload/upload.component";
import {ReportsComponent} from "./components/reports/reports.component";

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'upload',
    component: UploadComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
