import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EntidadComponent } from './entidad/entidad.component';
import { ModalEntidadlistaComponent } from './entidad/modal-entidadlista/modal-entidadlista.component';
import { ModalEntidadtablaComponent } from './entidad/modal-entidadtabla/modal-entidadtabla.component';


@NgModule({
  declarations: [
    EntidadComponent,
    ModalEntidadlistaComponent,
    ModalEntidadtablaComponent
  ],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    CoreModule,
    MaterialModule,

    NgxPaginationModule,
    NgxSpinnerModule,
  ]
})
export class MantenimientoModule { }
