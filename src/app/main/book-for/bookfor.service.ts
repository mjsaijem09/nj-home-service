import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})

export class BookforService {

  constructor(private apiService : ApiServicesService, private http: HttpClient) {}

  bookFor = (clientId: any) => this.apiService.get(`find_relations/${clientId}`);

  deleteBookForItem = (id: string, clientId: string) => this.apiService.put(`delete_relations?relation=${id}&id=${clientId}`);
}
