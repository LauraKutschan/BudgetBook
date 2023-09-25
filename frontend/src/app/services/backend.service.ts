import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {observable, Observable} from 'rxjs';
import { Report } from '../interfaces/reports';
import { User } from "../interfaces/user";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  reportsUrl = 'http://localhost:3000/reports';
  userUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  //USER
  registerNewUser(user: User): Observable<User>{
    return this.http.post<User>(this.userUrl, user);
  }

  checkIfExists(email: string): Observable<User>{
    return this.http.get<User>(this.userUrl + '/' + email);
  }

  loginUser(email: string, password: string): Observable<any>{
    return this.http.post<User>(this.userUrl+ '/login/' + email, { password: password });
  }

  // REPORTS
  getAllReports(): Observable<Report[]>{
    console.log("backend.service aufgerufen");
    return this.http.get<Report[]>(this.reportsUrl);
  }

  getOneReport(id: string): Observable<Report>{
    return this.http.get<Report>(this.reportsUrl + '/' + id);
  }

  getAllReportsToUser(user_id: string): Observable<Report[]>{
    console.log("backend.service aufgerufen");
    return this.http.get<Report[]>(this.reportsUrl + '/' + user_id);
  }

  addReport(data: Report): Observable<Report> {
    console.log('backendanbindung add aufgerufen: ' + data.file);
    return this.http.post<Report>(this.reportsUrl, data);
  }

  uploadFile(file: File | undefined): Observable<string> {
    console.log('backendanbindung upload aufgerufen: ' + file?.name);
    if(file) {
      return this.http.post<string>(this.reportsUrl + '/upload', this.getBodyForUpload(file));
    }
    return new Observable<string>();
  }

  getBodyForUpload(uploadFile: File): any {
    let uploadDate = new FormData();
    uploadDate.append('file', uploadFile, uploadFile?.name);
    return uploadDate;

  }

  updateReport(id: string, data: Report): Observable<Report> {
    return this.http.patch<Report>(this.reportsUrl + '/' + id, data);
  }

  deleteOneReport(id: string): Observable<any>{
    return this.http.delete<any>(this.reportsUrl + '/' + id, {observe: 'response'});
  }
}
