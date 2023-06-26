import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickedOutside]'
})
export class ClickedOutsideDirective {

  @Output()
  clickedOutside = new EventEmitter<Boolean>();

  constructor(private _elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const element = this._elementRef.nativeElement.contains(targetElement);
    this.clickedOutside.emit(element);
  }

}
