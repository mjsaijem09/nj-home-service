import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerData = new BehaviorSubject<any>(
    {
      data:[],
    }
  );
  
  setRegisterData(obj?: any) {
    this.registerData.next(obj);
  }

  getRegisterData(): Observable<any> {
    return this.registerData.asObservable();
  }
}
