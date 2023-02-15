import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroScoreComponent } from './registro-score/registro-score.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'lista', component: RegistroScoreComponent },
      // { path: 'reporte', component: ReporteEventoComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreRoutingModule { }
