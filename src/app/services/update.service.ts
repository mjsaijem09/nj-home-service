import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(public updates: SwUpdate) {
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
        .then((event) => {
          console.log('checking for updates', event);
          if(event == true) {
            this.initiateUpdate(event)
          }
        }));
    }
  }

  public checkForUpdates(): void {
    this.updates.available.subscribe(event => this.initiateUpdate(event));
  }

  private initiateUpdate(event): void {
    console.log('updating to new version', event);
    this.updates.activateUpdate().then(() => document.location.reload()); 
  }
}
