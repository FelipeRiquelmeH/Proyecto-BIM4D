import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[fcStyleCell]'
})
export class StyleCellDirective implements OnInit {
  @Input() fcStyleCell: string

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }
  ngOnInit(): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'text-align',
      'center',
    )
    if(this.fcStyleCell){
      if(this.fcStyleCell === undefined){
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'color',
          '#dcdcdc',
        )
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'text-align',
          'center',
        )
      }

      // if (/^\d+$/.test(this.fcStyleCell)) {
        // this.renderer.setStyle(
        //   this.elementRef.nativeElement,
        //   'text-align',
        //   'center',
        // )
      // }
    }
  }

}
