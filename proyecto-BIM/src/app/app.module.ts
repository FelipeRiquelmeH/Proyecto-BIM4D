import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskManagerComponent } from './tareas/task-manager/task-manager.component';
import { FcTreetableComponent } from './tareas/fc-treetable/fc-treetable.component';
import { StyleCellDirective } from './directives/style-cell.directive';
import { FormatCellPipe } from './pipes/format-cell.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BimViewerComponent } from './viewer/bim-viewer/bim-viewer.component';
import { ToastrModule } from 'ngx-toastr';
import { RecursoService } from './services/recurso.service';
import { DomChangeDirective } from './directives/dom-change.directive';
import { InfotableComponent } from './viewer/infotable/infotable.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    TaskManagerComponent,
    FcTreetableComponent,
    StyleCellDirective,
    FormatCellPipe,
    BimViewerComponent,
    DomChangeDirective,
    InfotableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FontAwesomeModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [
    RecursoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
