import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventoRoutingModule } from './evento-routing.module';
import { RegistroEventoComponent } from './registro-evento/registro-evento.component';
import { ModalEventoComponent } from './registro-evento/modal-evento/modal-evento.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ReporteEventoComponent } from './registro-evento/reporte-evento/reporte-evento.component';
import { ModalDetalleComponent } from './registro-evento/modal-detalle/modal-detalle.component';


@NgModule({
  declarations: [
    RegistroEventoComponent,
    ModalEventoComponent,
    ReporteEventoComponent,
    ModalDetalleComponent
  ],
  imports: [
    CommonModule,
    EventoRoutingModule,

    CoreModule,

    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule
  ]
})
export class EventoModule { }
