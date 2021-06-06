import { Component, OnInit } from '@angular/core';
import { Tarea } from '../models/tarea';
import { TreeNode } from '../models/treeNode';
import { RecursoService } from '../services/recurso.service';
import { faClipboardList} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit {
  tareas: Tarea[]
  
  public triggerModal: boolean = false
  public modalType: string = ''
  public actionMode: string

  selected: TreeNode | null
  multSelected : TreeNode[]

  readonly clipboardList = faClipboardList

  constructor(private recursoService: RecursoService) { }

  async ngOnInit(): Promise<void> {
    this.tareas = this.recursoService.getPlanificacionTest()
    let test = this.recursoService.getPlanificacion().subscribe(res => {
      console.log(res)
    })

    console.log(test)
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
