import { Component, Injectable, OnInit } from '@angular/core';
import { Tarea } from '../models/tarea';
import { TreeNode } from '../models/treeNode';
import { RecursoService } from '../services/recurso.service';
import { faClipboardList} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

moment.locale('es')

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
    let planificacion = await this.recursoService.getPlanificacion(2)
    this.tareas = this.formatJSON(planificacion["tareas"])
  }

  private formatJSON(array: any[]): Tarea[]{
    let tareas: Tarea[] = []
    for(let i = 0; i < array.length; i++){
      let tareaJSON = array[i]
      let tarea: Tarea = <Tarea>new Object()

      //Llenando datos de la tarea
      tarea.id = tareaJSON["id"]
      tarea.nombre = tareaJSON["nombre"]
      tarea.inicio = moment(tareaJSON["fecha_inicio"]).format('LL') 
      let fin = moment(tareaJSON["fecha_fin"])
      tarea.fin = fin.format('LL')
      let finReal = moment(tareaJSON["fin_real"])
      tarea.completa = finReal.isValid() ? finReal.format('LL') : ''
      let estado = tareaJSON["estado"]
      if(estado){
        let diff = finReal.diff(fin)
        if(diff == 0){
          tarea.estado = 'Completa'
        }else if (diff > 0){
          tarea.estado = 'Completa [Fuera de Plazo]'
        }else{
          tarea.estado = 'Completa [Adelantada]'
        }
      }else{
        tarea.estado = 'Pendiente'
      }

      if(tareaJSON["subtareas"].length > 0){
        tarea.subtareas = this.formatJSON(tareaJSON["subtareas"])
      }else{
        tarea.subtareas = []
      }

      tareas.push(tarea)
    }

    return tareas
  }

  private checkParentUndo(parent: TreeNode){
    if(parent.data.completa == ''){
      return false
    }else{
      let allClear: boolean = true
      for(let i = 0; i < parent.children!.length; i++){
        if(parent.children![i].data.completa == ''){
          allClear = false
          break;
        }
      }
      return allClear
    }
  }

  private checkParentUpdate(parent: TreeNode){
    let allClear: boolean = true
    let data: any = null
    let lastDate = parent.children![0].data.completa
    for(let i = 0; i < parent.children!.length; i++){
      if(parent.children![i].data.completa == ''){
        allClear = false
        break;
      }
      let diff = moment(lastDate,'LL').diff(moment(parent.children![i].data.completa, 'LL'))
      if(diff > 0){
        lastDate = parent.children![i].data.completa
      }
    }
    if(allClear){
      data = {
        idTarea: parent.data.id,
        finReal: moment(lastDate, 'LL').format('YYYY-MM-DD').toString()
      }
    }

    return [data]
  }

  private async update(queryData: any, tareas: TreeNode[]){
    const response = await this.recursoService.actualizarTarea(queryData)

    if(response){
      for(let i = 0; i < response.length; i++){
        if(response[i]['status'] == 1){
          let data = tareas[i].data
          let fin = moment(data.fechaFin), 
              finReal = moment(queryData.finReal),
              diff = finReal.diff(fin)
  
          data.completa = finReal.format('LL')
          
          if(diff == 0){
            data.estado = 'Completa'
          }else if(diff < 0){
            data.estado = 'Completa [Fuera de Plazo]'
          }else{
            data.estado = 'Completa [Adelantada]'
          }
  
          this.toastr.success(response[i]['message'],'Tarea completada!')
          this.triggerModal = false
          
          if(tareas[i].parent != null){
            let clearParent = this.checkParentUpdate(tareas[i].parent!)
            console.log(clearParent)
            if(clearParent != null){
              let diff = moment(clearParent['finReal'],'YYYY-MM-DD').diff(moment(tareas[i].parent!.data.completa,'LL'))
              if(tareas[i].parent!.data.completa == '' || diff > 0){
                this.update(clearParent,[tareas[i].parent!])
              }
            }
          }
        }else{
          this.triggerModal = false
          this.toastr.error(response[i]['message'], 'Error')
        }
      }
    }else{
      this.triggerModal = false
        this.toastr.error('No se pudo realizar la accion', 'Error')
    } 
  }

  private async undo(queryData: any, tarea: TreeNode[]){
    const response = await this.recursoService.deshacerTarea(queryData)

    if(response){
      for(let i = 0; i < response.length; i++){
        if(response[i]['status'] == 1){
          let data = tarea[i].data
        
          data.completa = ''
          data.estado = 'Pendiente'
  
          this.toastr.success(response[i]['message'],'Deshacer tarea exitoso!')
          this.triggerModal = false

          if(tarea[i].parent){
            let undoParent = this.checkParentUndo(tarea[i].parent!)
            if(undoParent){
              this.undo(tarea[i].parent!.data.id,[tarea[i].parent!])
            }
          }
        }else{
          this.triggerModal = false
          this.toastr.error(response[i]['message'], 'Error')
        }
      }
    }else{
      this.triggerModal = false
      this.toastr.error('No se pudo realizar la accion', 'Error')
    }
  }

  public actualizarTarea(){
    let subt = this.selected?.children!
    //Si no tiene subtareas
    if(!subt!.length){
      let fecha = <HTMLInputElement> document.querySelector('#finReal')
      let data = {
        idTarea: this.selected?.data?.id,
        finReal: fecha.value
      }
      let tareas = [data]
      let nodes = [this.selected!]
      
      this.update(tareas,nodes)
    //Si tiene subtareas
    }else{
      let dataSubt:any[] = []
      let nodes = [this.selected!]
      for(let i = 0; i < subt!.length; i++){
        //si la subtarea tiene mas subtareas no puede ser completada la accion
        if(subt[i]!.children?.length){
          this.triggerModal = false
          this.toastr.error('Tarea seleccionada tiene muchas subtareas para completar! ' + 
            'Tarea elegida solo puede tener un nivel de profundidad más!', 'Error')
          return
        }

        let fecha = <HTMLInputElement> document.querySelector('#finReal' + subt[i]!.data!.id)
        let data = {
          idTarea: subt[i]!.data!.id,
          finReal: fecha.value
        }
        nodes.push(subt[i])
        dataSubt.push(data)
      }
      this.update(dataSubt,nodes)
    }
  }

  public deshacerTarea(){
    let subt = this.selected?.children!
    if(!subt?.length){
      let id = this.selected?.data.id,
          tareas = [this.selected!]
      this.undo(id, tareas)
      
    }else{
      let idSubt: number[] = [this.selected!.data!.id]
      for(let i = 0; i < subt!.length; i++){
        if(subt[i]!.children?.length){
          this.triggerModal = false
          this.toastr.error('Tarea seleccionada tiene muchas subtareas para deshacer! ' + 
            'Tarea elegida solo puede tener un nivel de profundidad más!', 'Error')
          return
        }
        idSubt.push(subt[i]!.data!.id)
      }
      this.undo(idSubt,subt)
    }
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
    
    if(this.selected?.children?.length){
      this.modalType = 'multiple'  
    }else{
      this.modalType = event.seleccion
    }

    this.actionMode = event.accion
    this.triggerModal = true
  }
}
