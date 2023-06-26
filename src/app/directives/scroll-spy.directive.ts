import { Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
    selector: '[scrollSpy]'
})
export class ScrollSpyDirective implements OnInit{
    @Input() spiedTags: any;
    @Output() public sectionChange = new EventEmitter<string>();
    private currentSection!: string;

    constructor(private _el: ElementRef) {}

    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
      let currentSection: any;
      const children = this._el.nativeElement.children;
      const scrollTop = event.target.scrollTop;
      const parentOffset = event.target.offsetTop;
      for (let i = 0; i < children.length; i++) {
          const element = children[i];
          if (this.spiedTags.includes(element.tagName)) {
              if ((element.offsetTop - parentOffset) <= scrollTop) {
                if (element.id != '') {
                  currentSection = element.id;
                }
              }
          }
      }
      if (currentSection !== this.currentSection) {
          this.currentSection = currentSection;
          this.sectionChange.emit(this.currentSection);
      }
  }

    ngOnInit(){
    }
}
