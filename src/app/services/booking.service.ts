import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookingData: any = {};

  private slotBookingTime = new Subject<any>();
  private bookingDetails = new BehaviorSubject<any>({});

  constructor() { }
  
  startSlotBookingTime(obj:any){
    this.slotBookingTime.next(obj)
  }

  slotDetails(obj:any){
    this.slotBookingTime.next(obj)
  }

  getSlotBookingTime(): Observable<any> {
    return this.slotBookingTime.asObservable();
  }

  setBookingDetails(obj?: any) {
    this.bookingDetails.next(obj);
  }

  getBookingDetails() {
    return this.bookingDetails.asObservable();
  }

  isMobileView(){
    if (window.innerWidth  <= 768) {
      return true;
    }else{
      return false;
    }
  }
}
