import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCell'
})
export class FormatCellPipe implements PipeTransform {

  transform(value: any) {
    if(value === undefined || value === ''){
      return 'No disponible'
    }
    return value;
  }

}
