import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

// !TODO: 重構
@Directive({
  selector: '[autoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() autoFocus;

  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event.target']) onInput(input) {
    if (this.autoFocus) {
      const field = document.getElementById(this.autoFocus);
      console.log(field);
      if (field) {
        field.focus();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.elementRef.nativeElement.focus();
    }
  }
}
