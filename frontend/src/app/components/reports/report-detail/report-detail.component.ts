import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
import {Report} from "../../../interfaces/reports";
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";

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
  file?: File;
  bild?: any;

  constructor (private bs: BackendService,
               private route: ActivatedRoute,
               private sanitizer: DomSanitizer) {}

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

  downloadFile(fileId: string): void {
    this.bs.downloadFile(fileId).subscribe(
      (response) => {
        let arrayBufferView = new Uint8Array( response );
        console.log(arrayBufferView);
        let blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
        console.log(blob);
        this.bild = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      },
      error => console.log(error))
  }

  getReportViaId(id: string): void {
    this.bs.getOneReport(id).subscribe(
      (response) => {
        this.report = response;
        this.downloadFile(response.file);
      },
      error => console.log(error))
  }
}
