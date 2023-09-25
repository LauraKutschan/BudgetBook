import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {Report} from "../../interfaces/reports";
import { DexieService } from '../../services/dexie.service';
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: "longDate" }
    }
  ],
})
export class ReportsComponent implements OnInit{
  reports!: Report[];

  constructor(private bs: BackendService,
              private db: DexieService) {}

  ngOnInit(): void {
    this.db.table('reports').clear();
    this.bs.getAllReports().subscribe(
      (response: Report[]) => {
        this.reports = response;
        console.log(response[1]);
        console.log(this.reports[0]._id);
        response.forEach(report => {
          console.log('Report : ' + report);
          // insert into db
          this.db.table('reports')
            .add({userID: report.userID, type: report.type, date: report.date, location: report.location, desc: report.desc, images: report.file})
            .then(data => console.log(data))
            .catch(err => console.log(err));
        });
      },
      error => console.log(error));
  }
}
