import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { ValidarTokenGuard } from './core/guards/validar-token.guard';
import { BaseComponent } from './layout/base/base.component';

const routes: Routes = [
  { path: 'auth',
  loadChildren: () => import('./views/auth/auth.module').then((m) => m.AuthModule),
  canActivate: [NoAuthGuard]
},
{ path:'error',
  loadChildren: () => import('./views/errors/errors.module').then((m) => m.ErrorsModule),
},
{
  path:'',component:BaseComponent,
  children:[
    { path:'home',
      loadChildren: () => import ('./views/pages/home/home.module').then((m) => m.HomeModule),
      canActivate: [ValidarTokenGuard],
    },
    // { path:'evento',
    //   loadChildren: () => import ('./views/pages/evento/evento.module').then((m)=>m.EventoModule),
    //   canActivate: [ValidarTokenGuard],
    // },
    // {
    //   path:'mantenimiento',
    //   loadChildren: () => import ('./views/pages/mantenimiento/mantenimiento.module').then((m)=>m.MantenimientoModule),
    //   canActivate: [ValidarTokenGuard],
    //   // data: {rol_menu: [PERMISSION.MENU_MANTENIMIENTO]}
    // },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo:'/error/404' }
  ]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
