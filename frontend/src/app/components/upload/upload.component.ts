import { Component } from '@angular/core';

interface Topic {
  value: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  topics: Topic[] = [
    {value: 'Giftköder'},
    {value: 'Gefährliche Person'},
    {value: 'Gefährliches Tier'},
    {value: 'Entlaufender Hund'},
    {value: 'Andere Gefahr'}
  ];
}
