import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroEventoComponent } from './registro-evento/registro-evento.component';
import { ReporteEventoComponent } from './registro-evento/reporte-evento/reporte-evento.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'lista', component: RegistroEventoComponent },
      { path: 'reporte', component: ReporteEventoComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoRoutingModule { }
