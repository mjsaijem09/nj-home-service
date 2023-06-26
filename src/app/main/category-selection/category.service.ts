import { Injectable } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService : ApiServicesService) { 
  }
  category =(id:any,latPosition:any,logPosition:any)=>this.apiService.get(`category/shopsById?latt=${latPosition}&long=${logPosition}&dis=50&categoryId=${id}`)
}
