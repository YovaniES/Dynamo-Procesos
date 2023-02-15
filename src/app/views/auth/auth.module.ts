import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthRoutingModule,
    CoreModule,
    MatIconModule
  ]
})
export class AuthModule { }
