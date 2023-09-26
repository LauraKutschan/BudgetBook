import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
import '../interfaces/sync';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {

  constructor() {
    super("DexieDB");
    this.version(1).stores({
      reports: '++repId, userID, type, date, location, desc, lat, lon, images'
    });

// Now, add another version, just to trigger an upgrade for Dexie.Syncable
    this.version(2).stores({}); // No need to add / remove tables. This is just to allow the addon to install its tables.

    this.syncable.connect ("websocket", "https://syncserver.com/sync");
    this.syncable.on('statusChanged', function (newStatus, url) {
      console.log ("Sync Status changed: " + Dexie.Syncable.StatusTexts[newStatus]);
    });

    this.open()
      .then(data => console.log("DB Opened"))
      .catch(err => console.log(err.message));
  }
}
