import { Component } from '@angular/core';

@Component({
  selector: 'app-reporte-evento',
  templateUrl: './reporte-evento.component.html',
  styleUrls: ['./reporte-evento.component.scss']

})
export class ReporteEventoComponent {
  loading = false;
  message = '';
  g!: string;
}
