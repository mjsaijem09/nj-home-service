import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private subject = new Subject<any>();

  constructor() { }

  setHomeComplete(e:boolean) {
    this.subject.next({'isHomeComplete': e});
  }

  isHomeComplete?(): Observable<any> {
    return this.subject.asObservable();
  }
}
