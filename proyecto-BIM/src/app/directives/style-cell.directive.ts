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

      //Task Status Style
      switch(this.fcStyleCell){
        case 'Completa':{
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'background-color',
            '#196d00',
          )
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'color',
            'white',
          )
          break;
        }
        case 'Completa [Fuera de Plazo]':{
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'background-color',
            '#799400',
          )
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'color',
            'white',
          )
          break;
        }
        case 'Atrasada':{
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'background-color',
            '#8b1e00',
          )
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'color',
            'white',
          )
          break;
        }
        case 'Pendiente':{
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'background-color',
            '#0083af',
          )
          this.renderer.setStyle(
            this.elementRef.nativeElement,
            'color',
            'white',
          )
          break;
        }
        default:{
          break;
        }
      }

    }
  }

}
