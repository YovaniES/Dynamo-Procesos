import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ModalStoreComponent } from './registro-score/modal-score/modal-score.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from "ngx-spinner";
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { RegistroScoreComponent } from './registro-score/registro-score.component';


@NgModule({
  declarations: [
    RegistroScoreComponent,
    ModalStoreComponent,
  ],
  imports: [
    CommonModule,
    ScoreRoutingModule,

    CoreModule,

    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule
  ]
})
export class ScoreModule { }
