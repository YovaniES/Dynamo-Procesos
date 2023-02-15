import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private datePipe: DatePipe) {}

  generarPeriodo(fechaPeriodo: string) {
    console.log('fecha_p', fechaPeriodo.split('/'));

    const periodo: Date = new Date();
    const mesAndYear = fechaPeriodo.split('/');

    periodo.setMonth(parseInt(mesAndYear[1]) - 1);
    periodo.setFullYear(parseInt(mesAndYear[0]));
    periodo.setDate(1);

    console.log('PERIODO', periodo);
    console.log('FECHA_*', this.datePipe.transform(fechaPeriodo, 'yyyy-MM-dd'));

    return this.datePipe.transform(fechaPeriodo, 'yyyy-MM-dd');
  }
}

