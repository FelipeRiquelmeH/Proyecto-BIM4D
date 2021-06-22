import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  constructor(private http: HttpClient) { }

  async getPlanificacion(idPlanificacion: number){
    const body = {"idPlanificacion": idPlanificacion}
    const response = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/get`, body).toPromise()
    
    return response[0]
  }

  async actualizarTarea(datosTarea: any){
    let result
    if(datosTarea.length > 1){
      let tareas = [], fechas = []
      for(let i = 0; i < datosTarea.length; i++){
        tareas.push(datosTarea[i]['idTarea'])
        fechas.push(moment(datosTarea[i]['finReal']).format('YYYY-MM-DD'))
      }
      const body = {
        tareas: tareas,
        fechas: fechas
      }
      result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/updateMult`, body).toPromise()
    }else{
      result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/update`,datosTarea).toPromise()
    }

    return result
  }
  

  async deshacerTarea(idTarea: number | number[] ){
    let result
    if(Array.isArray(idTarea)){
      const body = {"idTareas": idTarea}
      result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/undoMult`,body).toPromise()
    }else{
      const body = {"idTarea": idTarea}
      result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/undo`,body).toPromise()
    }

    return result
  }

  async getAvances(idPlanificacion: number){
    const body = {"idPlanificacion": idPlanificacion}
    const result = await this.http.post<any>(`${environment.apiUrl}/api/bim/get`,body).toPromise()

    return result
  }

  async crearAvance(datosAvance: any){
    const response = await this.http.post<any>(`${environment.apiUrl}/api/bim/create`,datosAvance).toPromise()

    return response
  }

  async eliminarAvance(idAvance: number){
    const body = {"idAvance": idAvance}
    const result = await this.http.post<any>(`${environment.apiUrl}/api/bim/delete`,body).toPromise()

    return result
  }

}
