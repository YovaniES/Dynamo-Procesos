import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import { NgxSpinnerService } from 'ngx-spinner';

// import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-vacaciones',
  templateUrl: './asignar-observacion.component.html',
  styleUrls: ['./asignar-observacion.component.scss']
})
export class AsignarObservacionComponent implements OnInit {

  asigObservacionForm!: FormGroup;

  constructor(
    private scoreService: ScoreService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AsignarObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE_DET: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarObservacionByID();
    console.log('DATA_SCORE_DETALLE', this.DATA_SCORE_DET, this.DATA_SCORE_DET);
    console.log('DATA_SCORE_DET_OBS', this.DATA_SCORE_DET.observacion);
  }

  newForm(){
    this.asigObservacionForm = this.fb.group({
      observacion : ['', Validators.required],
    })
   }


  actualizarObservacion() {
    this.spinner.show();
    const formValues = this.asigObservacionForm.getRawValue();
    console.log('O B S', this.asigObservacionForm.value);

    let parametro: any[] = [{ queryId: 131,
        mapValue: {
          // p_idPeriodoVac         : this.DATA_SCORE_DET.idScored,
          p_observacion          : formValues.observacion ,
          // p_fecha_per_creacion   : '' ,
          CONFIG_USER_ID         : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: ''
        },
      }];
     this.scoreService.actualizarObservacion(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();
        this.cargarObservacionByID();

        this.close(true)
          Swal.fire({
            title: 'Actualizar Observación!',
            text : `La Observación fue actualizado con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.asigObservacionForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar la observación',
            'warning'
          );
        }
     });
  }

  cargarObservacionByID(){
      this.asigObservacionForm.controls['observacion'].setValue(this.DATA_SCORE_DET.observacion);
       console.log('DATOS_DET', this.asigObservacionForm.value);
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.asigObservacionForm.get(campo)?.invalid && this.asigObservacionForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}

