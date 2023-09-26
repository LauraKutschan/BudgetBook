import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {Report} from "../../../interfaces/reports";
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css'],
  providers: [
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: { dateFormat: "longDate" }
    }
  ]
})
export class ReportDetailComponent implements OnInit{

  report: Report = {_id: '', type: '', date: '', location: '', userID: '', desc: '', lat: 0, lon: 0, file: ''};

  constructor (private bs: BackendService,
               private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if(id) {
      this.getReportViaId(id);
    } else {
      console.log('no id');
      // router navigate back
    }
  }

  getReportViaId(id: string): void {
    this.bs.getOneReport(id).subscribe(
      (response) => {
        this.report = response;
      },
      error => console.log(error))
  }
}
