import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {

  constructor() {
    super("DexieDB");
    this.version(1).stores({
      reports: '++repId, userID, type, date, location, desc, images'
    });

    this.open()
      .then(data => console.log("DB Opened"))
      .catch(err => console.log(err.message));
  }
}
