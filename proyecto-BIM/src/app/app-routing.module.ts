import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BimViewerComponent } from './viewer/bim-viewer/bim-viewer.component';
import { TaskManagerComponent } from './tareas/task-manager/task-manager.component';

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
    path: 'modelo-bim', component: BimViewerComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
