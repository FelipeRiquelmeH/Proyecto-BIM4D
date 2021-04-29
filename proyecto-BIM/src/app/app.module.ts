import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ToolbarComponent } from './viewer/toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { FcTreetableComponent } from './fc-treetable/fc-treetable.component';
import { StyleCellDirective } from './directives/style-cell.directive';
import { FormatCellPipe } from './pipes/format-cell.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    ViewerComponent,
    ToolbarComponent,
    TaskManagerComponent,
    FcTreetableComponent,
    StyleCellDirective,
    FormatCellPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
