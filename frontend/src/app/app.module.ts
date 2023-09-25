import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ProfileComponent } from './components/profile/profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UploadComponent } from './components/upload/upload.component';
import { MapComponent } from './components/map/map.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import { ServiceWorkerModule } from '@angular/service-worker';
import {HttpClientModule} from "@angular/common/http";
import {WebcamModule} from "ngx-webcam";
import { CameraDialogComponent } from './components/camera-dialog/camera-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ReportDetailComponent } from './components/reports/report-detail/report-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    ProfileComponent,
    ReportsComponent,
    UploadComponent,
    MapComponent,
    CameraDialogComponent,
    ReportDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsModule,
    MatListModule,
    MatDividerModule,
    HttpClientModule,
    WebcamModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
