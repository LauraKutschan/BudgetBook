import { Component } from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {DexieService} from "../../services/dexie.service";
import {Report} from "../../interfaces/reports";
import {Observable, Observer, fromEvent, merge, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {DateAdapter} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {CameraDialogComponent} from "../camera-dialog/camera-dialog.component";
import {HttpClient} from "@angular/common/http";

interface Type {
  value: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  types: Type[] = [
    {value: 'Giftköder'},
    {value: 'Gefährliche Person'},
    {value: 'Gefährliches Tier'},
    {value: 'Entlaufener Hund'},
    {value: 'Andere Gefahr'}
  ];

  report?: Report;
  type: string = '';
  date: string = '';
  location: string = '';
  desc: string = '';

  today = new Date();

  file?: File;
  filename = '';


  constructor (private bs: BackendService,
               private db: DexieService,
               private dateAdapter: DateAdapter<Date>,
               public dialog: MatDialog,
               private http: HttpClient) {
    this.dateAdapter.setLocale('de-DE'); //dd/MM/yyyy
    this.createOnline().subscribe(isOnline => this.IDB(isOnline));}

  createOnline() {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  IDB(isOnline: any): void {
    if(isOnline) {

    }
  }

  uploadFile(): void {
    this.bs.uploadFile(this.file).subscribe(
      (response: string) => {
        console.log('File: ' + response);
        this.addReport(response);
      },
      error => console.log(error)
    );
  }

  addReport(id: string): void {
    try {
      let report: Report = {
        _id: '',
        userID: '',
        type: this.type,
        date: this.date,
        location: this.location,
        desc: this.desc,
        file: id
      }
      this.bs.addReport(report).subscribe(
        (response: Report) => {
          this.report = response;
          console.log(response);
        },
        error => console.log(error)
      );
      console.log('Online?: ' + navigator.onLine);
      if (!navigator.onLine) {
        this.addReportToIDB(report);
      }
    } catch (e) {
      console.log(e);
      //DELETE FILE
    }
  }

  addReportToIDB(report: Report): void {
    this.db.table('reports')
      .add({userID: '123', type: report.type, date: report.date, location: report.location, desc: report.desc, file: this.file})
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CameraDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.file = result.file;
      this.filename = result.file.name;
      console.log('HAHHAHAHA:::    ' + result.file.name);
    });
  }

  //geolocation
  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
      });
    }else {
      console.log("User not allow")

    }
  }

}
