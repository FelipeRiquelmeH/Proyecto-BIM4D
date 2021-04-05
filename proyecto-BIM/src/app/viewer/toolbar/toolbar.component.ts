import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Escribir codigo para cada funcion de la toolbar
  // usando libreria de xeokit o adaptando otra 

  resetPos(){
    // Llenar con llamada a funcion xeokit o crear
  }

  selectObj(){
    // Llenar con llamada a funcion xeokit o crear
  }

  firstPersonView(){
    // Llenar con llamada a funcion xeokit o crear
  }

  zoomMode(){
    // Llenar con llamada a funcion xeokit o crear
  }

  orbitMode(){
    // Llenar con llamada a funcion xeokit o crear
  }

  panMode(){
    // Llenar con llamada a funcion xeokit o crear
  }

  showProperties(){
    // Llenar con llamada a funcion xeokit o crear
  }

  hideObj(){
    // Llenar con llamada a funcion xeokit o crear
  }

  rollView(){
    // Llenar con llamada a funcion xeokit o crear
  }

  showMarkup(){
    // Llenar con llamada a funcion xeokit o crear
  }

  fullScreen(){
    // Llenar con llamada a funcion xeokit o crear
  }

  print(){
    // TAL VES?
    // Llenar con llamada a funcion xeokit o crear
  }
}