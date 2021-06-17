import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnMap } from 'src/app/models/columnMap';
import { RecursoService } from 'src/app/services/recurso.service';

@Component({
  selector: 'infotable',
  templateUrl: './infotable.component.html',
  styleUrls: ['./infotable.component.scss']
})
export class InfotableComponent implements OnChanges {
  @Input() values: any[]

  private idPlanificacion = 2

  columnMaps: ColumnMap[]

  constructor(private recursoService: RecursoService) { }

  ngOnChanges(changes) {
    if(this.values){
      let keys = Object.keys(this.values[0])
      // let nivel = keys.indexOf('nivel')
      // if(nivel){
      //   keys.splice(nivel, 1)
      // }

      // Genera los headers
      this.columnMaps = keys
      .map( key => {
        return new ColumnMap( { primaryKey: key})
      })
    }
  }

}
