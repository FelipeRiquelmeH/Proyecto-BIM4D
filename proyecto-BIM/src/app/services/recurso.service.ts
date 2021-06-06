import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Test } from '../test';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  constructor(private http: HttpClient) { }

  getPlanificacion(){
    let url = 'http://localhost:3000'
    const response = this.http.get(`${url}/api/planificacion/get`)

    console.log(response)

    return response
  }

  getPlanificacionTest(){
    // return this.http.get('')
    return new Test().data
  }
}
