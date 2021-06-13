import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Test } from '../test';
import { environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  constructor(private http: HttpClient) { }

  getPlanificacionTest(){
    // return this.http.get('')
    return new Test().data
  }

  async getPlanificacion(){
    const response = await this.http.get<any>(`${environment.apiUrl}/api/planificacion/get`).toPromise()
    
    return response
  }

  async completarTarea(datosTarea: any){
    const result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/complete`,datosTarea).toPromise()

    return result
  }

  async editarTarea(datosTarea: any){
    const result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/update`,datosTarea).toPromise()

    return result
  }

  async deshacerTarea(datosTarea: any){
    const result = await this.http.post<any>(`${environment.apiUrl}/api/planificacion/delete`,datosTarea).toPromise()

    return result
  }

  async getAvances(idPlanificacion: number){
    const result = await this.http.post<any>(`${environment.apiUrl}/api/bim/get`,idPlanificacion).toPromise()

    return result
  }

}
