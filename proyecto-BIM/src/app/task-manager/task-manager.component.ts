import { Component, OnInit } from '@angular/core';
import { Tarea } from '../models/tarea';
import { TreeNode } from '../models/treeNode';
import { Test } from '../test'

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  tareas: Tarea[] = new Test().data
  
  public triggerModal: boolean = false
  public modalType: string = ''
  public actionMode: string

  selected: TreeNode | null
  multSelected : TreeNode[]

  constructor() { }

  ngOnInit(): void {
  }

  public completarTarea(){
    if(this.selected?.children?.length){
      console.log('Tiene hijos')
    }
  }

  public editarTarea(){

  }

  private deshacerTarea(tareas: TreeNode[]){

  }

  onNotify(event: any){
    this.selected = null
    this.multSelected = []

    if(event.tareas.length = 1){
      this.selected = event.tareas[0]
    }
    if(event.tareas.length > 1){
      this.multSelected = event.tareas
    }
    
    this.modalType = event.seleccion
    this.actionMode = event.accion
    this.triggerModal = true
  }
}
