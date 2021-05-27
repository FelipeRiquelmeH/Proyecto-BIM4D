import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tareas',
    pathMatch: 'full',
  },
  {
    path: 'tareas', component: TaskManagerComponent
  },
  {
    path: 'modelo-bim', component: ViewerComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
