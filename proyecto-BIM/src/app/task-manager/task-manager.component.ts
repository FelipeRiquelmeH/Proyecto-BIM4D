import { Component, Injectable, OnInit } from '@angular/core';
import { Tarea } from '../models/tarea';
import { TreeNode } from '../models/treeNode';
import { RecursoService } from '../services/recurso.service';
import { faClipboardList} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
@Injectable()
export class TaskManagerComponent implements OnInit {
  tareas: Tarea[]
  
  public loading: boolean = false
  public triggerModal: boolean = false
  public modalType: string = ''
  public actionMode: string
  public alert: boolean = false
  public alertMessage: string = ''

  selected: TreeNode | null
  multSelected : TreeNode[] = []

  readonly clipboardList = faClipboardList

  constructor(
    private recursoService: RecursoService,
    private toastr: ToastrService  
  ) { }

  async ngOnInit(): Promise<void> {
    this.tareas = this.recursoService.getPlanificacionTest()
    let test = await this.recursoService.getPlanificacion()

    console.log(test)
  }

  private async sendQuery(queryData: any, route: string){
    switch(route){
      case 'completar':{
        return await this.recursoService.completarTarea(queryData)
      }
      case 'editar':{
        return await this.recursoService.editarTarea(queryData)
      }
      case 'deshacer':{
        return await this.recursoService.deshacerTarea(queryData)
      }
      default:{
        return null
      }
    }
  }

  private async update(queryData: any, route: string, tareas: TreeNode[]){
    const response = await this.sendQuery(queryData, route)

    if(response){
      if(response['status'] == 1){
        for(let i = 0; i < response.length; i++){
          let data = tareas[i].data
  
          let fin = moment(data.fechaFin), 
              finReal = moment(queryData[i].finReal),
              diff = finReal.diff(fin)
  
          if(diff == 0){
            data.estado = 'Completa'
          }else if(diff < 0){
            data.estado = 'Completa [Fuera de Plazo]'
          }else{
            data.estado = 'Completa [Adelantada]'
          }
  

          this.toastr.success(response['message'],'Tarea completada!')
          this.triggerModal = false
        }
      }else{
        this.triggerModal = false
        this.toastr.error(response['message'], 'Error')
      }
    }   
  }

  public completarTarea(){
    if(!this.selected?.children?.length){
        this.selected?.data.id
        let fecha = <HTMLInputElement> document.querySelector('#finReal')
        let data = {
          idTarea: this.selected?.data?.id,
          finReal: fecha.value
        }
        
        this.update(data,'Completar',this.multSelected)
      
    }else{ 
      this.triggerModal = false
      this.toastr.error('Tarea seleccionada tiene subtareas por completar!', 'Error')
    }
  }

  public editarTarea(){

  }

  private deshacerTarea(tareas: TreeNode[]){
    
  }

  private setAlert(type: string, message: string){
    if(message){
      switch(type){
        case 'Success':{
  
          break;
        }
        case 'Error': {
          break;
        }
        case 'Warning': {
          break;
        }
        default: {
          break;
        }
      }
      this.alertMessage = message
      this.alert = true
    }
  }

  public clearAlert(){
    this.alertMessage = ''
    this.alert = false
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
