import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2  } from '@angular/core';
import {A11y, Mousewheel, Navigation, Pagination, SwiperOptions, Swiper} from 'swiper';

@Component({
  selector: 'app-online-shop',
  templateUrl: './online-shop.component.html',
  styleUrls: ['./online-shop.component.scss']
})

export class OnlineShopComponent implements OnInit {
  @Input() shopDetails;
  @ViewChild('parentSlide', { static: true }) parentSlide: ElementRef;
  activeNav = 'shop';

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const _parentSlide = this.parentSlide.nativeElement;

    // Add the event listener
    this.renderer.listen(_parentSlide, 'slidechange', (event) => {
      const [swiper, progress] = event.detail;
      const currentSlideId = swiper.slides[swiper.activeIndex].id;
      if(currentSlideId)
      this.activeNav = currentSlideId;
    });  
  }
  navOutput(e) {
    const swiper = new Swiper(this.parentSlide.nativeElement, {
      initialSlide: 0,
    });
    if(e){
      this.activeNav = e;
      switch (e) {
        case 'shop':
          swiper.slideTo(1);
          swiper.slideTo(0);
          break;
        case 'products':
          swiper.slideTo(1);
          break;
        case 'categories':
          swiper.slideTo(2);
          break;
        default:
          swiper.slideTo(0);
          break;
      }
    }
  }

}
