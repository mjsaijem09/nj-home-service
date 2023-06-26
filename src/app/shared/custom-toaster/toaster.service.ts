import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next(event);
        }
      }
    });
  }
  // OnSuccess Show message
  success(message: string, keepAfterNavigationChange = false, timer = 10000) {

    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message, timer, msgId: this.genrateId() });
  }

  // Onerror show message
  error(message: string, keepAfterNavigationChange = false, timer = 10000) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message, timer, msgId: this.genrateId() });
  }

  info(message: string, keepAfterNavigationChange = false, timer = 10000) {

    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'info', text: message, timer, msgId: this.genrateId() });
  }

  warning(message: string, keepAfterNavigationChange = false, timer = 10000) {

    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'info', text: message, timer, msgId: this.genrateId() });
  }

  // getMessage is method to take message from component
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }


  genrateId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
