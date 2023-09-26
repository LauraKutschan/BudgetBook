import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {DexieService} from "../../services/dexie.service";
import {Report} from "../../interfaces/reports";
import {Observable, Observer, fromEvent, merge, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {DateAdapter} from "@angular/material/core";
import {MatDialog} from "@angular/material/dialog";
import {CameraDialogComponent} from "../camera-dialog/camera-dialog.component";
import Map from "ol/Map";
import View from "ol/View";
import * as olProj from "ol/proj";
import {Feature} from "ol";
import {fromLonLat} from "ol/proj";
import {Point} from "ol/geom";
import {Style} from "ol/style";
import Icon from "ol/style/Icon";
import { Tile as TileLayer, Vector as LayerVector } from 'ol/layer';
import { OSM, Vector as SourceVector } from 'ol/source';
import {Router} from "@angular/router";

interface Type {
  value: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  types: Type[] = [
    {value: 'Giftköder'},
    {value: 'Gefährliche Person'},
    {value: 'Gefährliches Tier'},
    {value: 'Entlaufener Hund'},
    {value: 'Andere Gefahr'}
  ];

  lat = 0;
  lon = 0;
  report?: Report;
  type: string = '';
  date: string = '';
  location: string = '';
  desc: string = '';

  today = new Date();

  file?: File;
  filename = '';
  url: string | ArrayBuffer | null = '';

  resourcesLoaded: boolean = true;


  map?: Map;
  markerLayer: any;
  marker!: any;
  online?: boolean;

  constructor (private bs: BackendService,
               private db: DexieService,
               private dateAdapter: DateAdapter<Date>,
               public dialog: MatDialog,
               public router: Router) {
    this.dateAdapter.setLocale('de-DE'); //dd/MM/yyyy
    this.createOnline().subscribe(isOnline => this.IDB(isOnline));}

  ngOnInit(){
    this.initializeMap()
  }

  initializeMap(): void {
    this.map = new Map({
      target: 'hotel_map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
      ],
      view: new View({
        center: olProj.fromLonLat([13.404954, 52.5200066]),
        zoom: 10
      })
    });
  }

  setMarker(lat: number, lon: number): void {
    if(this.markerLayer) {
      const features = this.markerLayer.getSource().getFeatures();
      features.forEach((feature: any) => {
        this.markerLayer.getSource().removeFeature(feature);
      });
    }
    this.marker = new Feature({
      geometry: new Point(fromLonLat([lat, lon]))
    });

    this.markerLayer = new LayerVector({
      source: new SourceVector({
        features: [this.marker]
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '../../../assets/icons/marker.png'
        })
      })
    });
    this.map?.addLayer(this.markerLayer);
  }

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
    console.log('ONLINE??:  ' + isOnline);
    this.online = isOnline;
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
        lat: this.lat,
        lon: this.lon,
        file: id
      }
      this.bs.addReport(report).subscribe(
        (response: Report) => {
          this.report = response;
          this.router.navigateByUrl('/');
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
      .add({userID: '123', type: report.type, date: report.date, location: report.location, desc: report.desc, lat: this.lat, lon: this.lon, file: this.file})
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CameraDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.file = result.file;
      this.filename = result.file.name;
      const reader = new FileReader();
      reader.readAsDataURL(result.file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    });
  }



  //geolocation
  getLocation(): void {
    this.location = '';
    this.resourcesLoaded = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.reverseGeocode({lat: position.coords.latitude, lon: position.coords.longitude});
        if(this.online) {
          this.setMarker(position.coords.longitude, position.coords.latitude);
        }
      }, err => {
        console.log(err);
        this.resourcesLoaded = true;
      },{ timeout: 5000});
    } else {
      this.resourcesLoaded = true;
      console.log("User not allow")
      alert('Couldn\'t fetch location, please enter manually!');
    }
  }

  reverseGeocode(params: any) {
    params.format = 'json';
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url, {method: 'GET'}).then(res => {
      res.json().then(json => {
        this.resourcesLoaded = true;
        console.log(json.address);
        this.lat = params.lat;
        this.lon = params.lon
        if(json.address.city) {
          this.location = json.address.road + ' ' + json.address.house_number + ', ' + json.address.postcode + ' ' + json.address.city;
        } else {
          this.location = json.address.road + ' ' + json.address.house_number + ', ' + json.address.postcode + ' ' + json.address.town;
        }
      })
    });
  }

  getCoord(event: any){
    if (this.map instanceof Map) {
      const coordinate = olProj.toLonLat(this.map.getEventCoordinate(event));
      this.reverseGeocode({lat: coordinate[1], lon: coordinate[0]})
      this.setMarker(coordinate[0], coordinate[1]);
    }
  }

  deleteFile() {
    this.file = undefined;
    this.url = null;
  }
}
