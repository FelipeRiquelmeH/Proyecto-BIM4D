import { Component, OnInit } from '@angular/core';
import { Tarea } from '../models/tarea';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  tareas: Tarea[] = [
    {
      id: '1',
      nombre: 'Informe Avance',
      estado: 'Completa',
      inicio: '28 Marzo 2021',
      fin: '16 Abril 2021',
      completa: '16 Abril 2021',
      subtareas: []
    },
    {
      id: '2',
      nombre: 'Software',
      estado: 'Pendiente',
      inicio: '26 Abril 2021',
      fin: '18 Junio 2021',
      completa: '',
      subtareas: [
        {
          id: '6',
          nombre: 'Crear tabla',
          estado: 'Pendiente',
          inicio: '26 Abril 2021',
          fin: '28 Abril 2021',
          completa: '',
          subtareas: [
            {
              id: '7',
              nombre: 'Como se hace esto jaja',
              estado: 'Completa',
              inicio: '26 Abril 2021',
              fin: '26 Abril 2021',
              completa: '26 Abril 2021',
              subtareas: []
            },
            {
              id: '8',
              nombre: 'Crear template tabla',
              estado: 'Completa',
              inicio: '27 Abril 2021',
              fin: '27 Abril 2021',
              completa: '27 Abril 2021',
              subtareas: []
            },
            {
              id: '9',
              nombre: 'Mapear datos en tabla',
              estado: 'Completa',
              inicio: '27 Abril 2021',
              fin: '27 Abril 2021',
              completa: '27 Abril 2021',
              subtareas: []
            },
            {
              id: '10',
              nombre: 'Crear arbol de datos',
              estado: 'Completa [Fuera de Plazo]',
              inicio: '27 Abril 2021',
              fin: '27 Abril 2021',
              completa: '28 Abril 2021',
              subtareas: []
            },
            {
              id: '11',
              nombre: 'Definir jerarquia de datos',
              estado: 'Completa',
              inicio: '28 Abril 2021',
              fin: '28 Abril 2021',
              completa: '28 Abril 2021',
              subtareas: []
            },
            {
              id: '12',
              nombre: 'Arreglar estilos tabla',
              estado: 'Pendiente',
              inicio: '28 Abril 2021',
              fin: '30 Abril 2021',
              completa: '',
              subtareas: []
            },
          ]
        }
      ]
    },
    {
      id: '3',
      nombre: 'Informe Final',
      estado: 'Pendiente',
      inicio: '25 Junio 2021',
      fin: '7 Julio 2021',
      completa: '',
      subtareas: [
        {
          id: '13',
          nombre: 'Añadir contenido nuevo',
          estado: 'Pendiente',
          inicio: '25 Junio 2021',
          fin: '27 Julio 2021',
          completa: '',
          subtareas: []
        },
        {
          id: '14',
          nombre: 'Presentar resultados y diseño final',
          estado: 'Pendiente',
          inicio: '28 Junio 2021',
          fin: '30 Julio 2021',
          completa: '',
          subtareas: []
        },
        {
          id: '15',
          nombre: 'Corregir errores anteriores',
          estado: 'Pendiente',
          inicio: '1 Julio 2021',
          fin: '3 Julio 2021',
          completa: '',
          subtareas: []
        },
        {
          id: '16',
          nombre: 'Preparar defensa',
          estado: 'Pendiente',
          inicio: '4 Julio 2021',
          fin: '7 Julio 2021',
          completa: '',
          subtareas: []
        },
      ]
    },
    {
      id: '4',
      nombre: 'Defensa de Proyecto',
      estado: 'Pendiente',
      inicio: '12 Julio 2021',
      fin: '16 Julio 2021',
      completa: '',
      subtareas: []
    },
    {
      id: '5',
      nombre: 'Titulacion?',
      estado: 'Pendiente',
      inicio: '19 Julio 2021',
      fin: '30 Agosto 2021',
      completa: '',
      subtareas: [
        {
          id: '50',
          nombre: 'Enviar proyecto a biblioteca',
          estado: 'Pendiente',
          inicio: '19 Julio 2021',
          fin: '24 Julio 2021',
          completa: '',
          subtareas: []
        },
        {
          id: '51',
          nombre: 'Pagar titulo',
          estado: 'Pendiente',
          inicio: '25 Julio 2021',
          fin: '31 Julio 2021',
          completa: '',
          subtareas: []
        },
        {
          id: '52',
          nombre: 'No poder celebrar porque ahora estas trabajando',
          estado: 'Pendiente',
          inicio: '1 Agosto 2021',
          fin: '31 Agosto 2021',
          completa: '',
          subtareas: []
        },
      ]
    },
    
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
