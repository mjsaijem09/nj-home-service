import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ApiServicesService {
  private profileData = new BehaviorSubject('');
  sendProfileData = this.profileData.asObservable();
  staffIdData: any;
  staffLocationData: any;

  private filterUpdate: any = new Subject();
  filterUpdateSubscribe = this.filterUpdate.asObservable();

  setLoginData(data: any) {
    this.loginData.next(data);
  }
  public loginData = new BehaviorSubject<any>('');

  getLoginData = this.loginData.asObservable();

  getLoginDataa(): Observable<any> {
    return this.getLoginData;
  }
  setCustomerLocation(data: any) {
    this.customerLocation.next(data);
  }
  public customerLocation = new BehaviorSubject<any>('');

  getCustomerLocationData = this.customerLocation.asObservable();

  getLocationData(): Observable<any> {
    return this.getCustomerLocationData;
  }

  // public customerLogin= new BehaviorSubject()

  selectedIndex: any = 0;
  url: string = 'rating/staff_review/';
  imageUrl = environment.image_url; //image url
  httpClient: any;
  constructor(private http: HttpClient) {}
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${environment.api_url}${path}`, { params: params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  patch(path: string, body: Object = {}): Observable<any> {
    return this.http
      .patch(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(body))
      .pipe(catchError(this.formatErrors));
  }

  postNew(
    path: string,
    params: HttpParams = new HttpParams(),
    body: Object = {}
  ): Observable<any> {
    return this.http
      .post(`${environment.api_url}${path}`, JSON.stringify(body), {
        params: params,
      })
      .pipe(catchError(this.formatErrors));
  }
  putNew(
    path: string,
    params: HttpParams = new HttpParams(),
    body: Object = {}
  ): Observable<any> {
    return this.http
      .put(`${environment.api_url}${path}`, JSON.stringify(body), {
        params: params,
      })
      .pipe(catchError(this.formatErrors));
  }
  patchNew(
    path: string,
    params: HttpParams = new HttpParams(),
    body: Object = {}
  ): Observable<any> {
    return this.http
      .patch(`${environment.api_url}${path}`, JSON.stringify(body), {
        params: params,
      })
      .pipe(catchError(this.formatErrors));
  }
  delete(path: any): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`)
      .pipe(catchError(this.formatErrors));
  }
  deleteNew(path: any, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .delete(`${environment.api_url}${path}`, { params: params })
      .pipe(catchError(this.formatErrors));
  }
  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getdata(_id: any) {
    return this.http
      .get(`${environment.api_url}${this.url}${_id}`)
      .pipe(catchError(this.formatErrors));
  }

  postImage(path: string, body: any): Observable<any> {
    console.log(path, body);
    return this.http
      .post(`${environment.image_url + '/api/'}${path}`, body)
      .pipe(catchError(this.formatErrors));
  }

  setProfile(data: string) {
    this.profileData.next(data);
  }

  applyFilterChange(data: any) {
    this.filterUpdate.next(data);
  }

  getAppointmentsListing(_id: any): Observable<any> {
    return this.http
      .get(`${environment.api_url}appointments/group/${_id}`)
      .pipe(catchError(this.formatErrors));
  }

  imageProductTranslator(image) {
    if (Array.isArray(image) && image.length) {
      return image.map((element) => {
        return (element = `${environment.image_url}${element}`);
      });
    } else {
      if (image.indexOf(environment.image_url) > -1) {
        return `${image}`;
      } else {
        return `${environment.image_url}${image}`;
      }
    }
  }

  postNuskin(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(
        `${environment.socket_url}/api/nu_skin/${path}`,
        JSON.stringify(body)
      )
      .pipe(catchError(this.formatErrors));
  }

  getNuskin(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${environment.socket_url}/api/nu_skin/${path}`, { params: params })
      .pipe(catchError(this.formatErrors));
  }
}
