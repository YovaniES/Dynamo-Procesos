import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {

  loginForm: FormGroup = this.fb.group({
    username    : ['', [Validators.required]],
    password    : ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    // private spinner: NgxSpinnerService
  ) {}

  login() {
    this.authService.login_auditoria( this.loginForm.value ).pipe(first()).subscribe( resp => {

        if (resp) {
          // this.spinner.hide();

          Swal.fire(
            "Inicio de Sesión",
            "Bienvenid@ <br />" + `${resp.user.nombres} ${resp.user.apellidoPaterno}`,
            "success"
          );
          this.router.navigateByUrl('home');
        }
      }, error => {
        // this.spinner.hide();
        Swal.fire('Error', 'Credenciales Incorrectas', 'error' );
      });
  }

  campoNoValido(campo: string): boolean {
    if (this.loginForm.get(campo)?.invalid && this.loginForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }
}
