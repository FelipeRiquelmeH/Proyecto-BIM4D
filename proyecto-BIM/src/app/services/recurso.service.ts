import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Test } from '../test';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  constructor(private http: HttpClient) { }

  getPlanificacion(){
    // return this.http.get('')
    return new Test().data
  }
}
