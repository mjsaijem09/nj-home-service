import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  userSearch = new Subject;

  constructor() { }

  setUserSearch(obj?: any) {
    this.userSearch.next(obj);
  }

  getUserSearch() {
    return this.userSearch.asObservable();
  }
}
