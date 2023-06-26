import { AuthServiceService } from './auth-service.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  public authToken: any;
  constructor(public auth: AuthServiceService, private route: Router) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.getToken()) {
      request = request.clone({ headers: request.headers.set('Authorization', `Bearer ${this.auth.getToken()}`) });
    }
    if (!request.headers.has('Content-Type')) {
      if(request.url.indexOf('assets/uploadImages') > 0){
      // request = request.clone({headers: request.headers.set('Content-Type','multipart/form-data; boundary=------WebKitFormBoundaryWaYVzReVi65jkvJF')})
      }
      else{
        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
      }
    }
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // 
          return event;
        }
      }, error => {
        // http response status code
        return this.handleAuthError(error);
      })
    )
  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    console.log(err);
    //handle your auth error or rethrow
    if (err.status === 401) {
      //navigate /delete cookies or whatever

      // this.route.navigate(['auth/login'])
      return of(err.message);
    }
    throw err;
  }

}
