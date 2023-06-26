import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LocationService } from 'src/app/services/location.service';
import { CategoryService } from './category.service'
import { LocationSelectionPopupComponent } from 'src/app/location-popups/location-selection-popup/location-selection-popup.component';
@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss']
})
export class CategorySelectionComponent implements OnInit, OnDestroy {

  routeData: any;
  id: any;
  blogList: any = [];
  sponsoredList: any = [];
  shopList: any = [];
  topRatedShopList: any = []
  topRankedTherapistList: any = []
  videosList: any = []
  topRatedTherapistList: any = []
  location: any
  latPosition: any
  logPosition: any;
  safeSrc: SafeResourceUrl | undefined
  videoUrl: any;
  thumbnail: any;
  newVideoData: any = []
  isShowSearchBar: boolean = false;
  searchText = "";
  shopType: string = 'nearest';
  categoryId: any;
  isLoading: boolean = false;
  coordinates: any = { lat: 31.9523, lng: 115.8613 };   //Perth
  shops:any = [];
  searchLocation = "";
  subscription!: Subscription;
  searchTimeout: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryservice: CategoryService,
    private sanitizer: DomSanitizer,
    private locationService: LocationService,
    private apiService : ApiServicesService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(params => {
      this.locationService.headerTitle = params['categoryName'];
      this.categoryId = params['categoryId'];
    });
    
    // Location result
    this.subscription = this.locationService.getUserLocation().subscribe((res:any) => {
      console.log('get position', res);
      this.coordinates = {
        'lat': res.latitude,
        'lng': res.longitude,
      };
      this.searchLocation = res.name;
      this.getShopList(this.shopType);
    }, (err:any) => {
      console.log(err);
    })
    // Search result
    this.subscription = this.locationService.getUserSearch().subscribe(res => {
      this.searchText = res;
      console.log("Search result", this.searchText);
      this.getShopList(this.shopType);
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  getCategorydata() {
    this.isLoading = true;
    this.categoryservice.category(this.id, this.coordinates.lat, this.coordinates.lng).subscribe((res: any) => {
      this.blogList = res.result.blogs
      this.sponsoredList = res.result.sponsoredShop
      this.shopList = res.result.shops
      console.log("dgfd", this.shopList);

      this.topRatedShopList = res.result.topRatedShop
      this.topRankedTherapistList = res.result.topRankedTherapist
      this.videosList = res.result.videos;
      for (let i = 0; i < res.result.videos.length; i++) {
        this.videoUrl = res.result.videos[i].url
        let finalUrl = this.videoUrl.replace("watch?v=", "embed/")
        this.topRatedTherapistList = res.result.topRatedTherapist
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
        let neoObj = {
          name: res.result.videos[i].name,
          url: this.safeSrc
        }
        this.newVideoData.push(neoObj)
      }
      this.isLoading = false
    });

  }

  // routing
  goToTherapist(item: any) {
    console.log(item);
    this.router.navigate(['/therapist'], {
      queryParams: {
        therapistName: `${item.firstName} ${item.lastName}`,
        id: item._id,
      }
    })
  }

  navigateToSearchCity() {
    this.modalService.open(LocationSelectionPopupComponent, {centered: true});
  }

  search() {
    if (this.searchTimeout) {
      this.clearSearchTimeout();
    }
    this.searchTimeout = setTimeout(() => {
      this.getShopList(this.shopType);
      this.clearSearchTimeout();
    }, 500);
  }

  clearSearchTimeout() {
    clearTimeout(this.searchTimeout);
  }

  getShopList(type: string) {
    if(this.coordinates) {
      this.isLoading = true;
      this.shopType = type;
      let search = '';
      if (this.searchText){
        search = 'search=' + this.searchText + '&'
      }
      this.apiService.get(`get_shop_list?${search}latt=${this.coordinates?.lat}&long=${this.coordinates?.lng}&categoryId=${this.categoryId}&${type}=true`).subscribe(res => {
        this.shops = res.result;
        this.isLoading = false;
      },err => {
        this.isLoading = false;
        console.log(err);
      })
    }
  }
}
