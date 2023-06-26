import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewPortService {

  smallDevice(){
    if (window.innerWidth  >= 768) {
      return false;
    }else{
      return true;
    }
  }
}
