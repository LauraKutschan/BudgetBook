import {Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import {format} from "ol/coordinate";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{
  map?: Map;

  constructor() {

  }

  ngOnInit(){
    this.map = new Map({
      target: 'hotel_map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([7.0785, 51.4614]),
        zoom: 5
      })
    });

    this.reverseGeocode({lat: 52.5200066, lon: 13.404954});
  }

  reverseGeocode(params: any) {
    params.format = 'json';
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url, {method: 'GET'}).then(res => {
      res.json().then(json => {
        console.log(json.address);
      })
    });
  }


}
