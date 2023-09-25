import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {WebcamImage} from "ngx-webcam";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.css']
})
export class CameraDialogComponent {


  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<CameraDialogComponent>
  ) {}


  //webcam

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  public captureImg(webcamImage: WebcamImage): void {
    console.log('hiiier:  ' + webcamImage);
    this.webcamImage = webcamImage;
    this.handleCapturedImage(webcamImage);
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  handleCapturedImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    const arr = this.webcamImage.imageAsDataUrl.split(",");
    const matches = arr[0].match(/:(.*?);/);
    if(matches) {
      const mime = matches[1];
    }
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const filename = 'file';
    const file: File = new File([u8arr], filename, { type: 'image/png' })
    this.dialogRef.close({file: file});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
