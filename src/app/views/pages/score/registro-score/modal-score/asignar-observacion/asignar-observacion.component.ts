import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import { UtilService } from 'src/app/core/services/util.service';
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
    private utilService: UtilService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AsignarObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarPeriodosByID();
    this.getListEstadoDetalle();
    console.log('DATA_SCORE_PERIODO', this.DATA_SCORE, this.DATA_SCORE.vdForm);
    // console.log('ID_PERS_VACAC', this.DATA_SCORE.vacForm.idPersonal); //idPersonal= 496
  }

  newForm(){
    this.asigObservacionForm = this.fb.group({
      id_estado     : [ 2, [Validators.required]],
      estado_periodo: ['Planificado'],
      id_motivo     : [ 5, [Validators.required]], //Motivo_5 : NINGUNO
      observaciones : [''],
    })
   }

   agregarOactualizarPeriodo(){
    if (!this.DATA_SCORE) {return}

    if (this.DATA_SCORE.isCreation) {
      if (this.asigObservacionForm.valid) {
        // this.agregarPeriodoVacaciones()
      }
    } else {
      // this.actualizarPeriodo();
    }
   }

  //  agregarPeriodoVacaciones() {
  //   this.spinner.show();

  //   const formValues = this.asigObservacionForm.getRawValue();

  //   let parametro: any =  {queryId: 129, mapValue: {
  //         p_id_vacaciones        : this.DATA_SCORE.vacForm.idVacaciones.idVac,
  //         p_id_persona           : this.DATA_SCORE.vacForm.idVacaciones.id_persona ,
  //         p_fecha_per_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
  //         p_fecha_per_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
  //         p_id_per_estado        : formValues.id_estado ,
  //         p_id_per_motivo        : formValues.id_motivo ,
  //         p_observacion          : formValues.observaciones ,
  //         p_id_usuario_asignacion: this.userID ,
  //         p_fecha_per_creacion   : '' ,
  //         p_id_sist_vac          : this.DATA_SCORE.vacForm.idVacaciones.id_sist_vac,
  //         p_jira                 : formValues.jira? 1 : 0,
  //         p_dedicaciones         : formValues.dedicaciones? 1 : 0 ,
  //         CONFIG_USER_ID         : this.userID ,
  //         CONFIG_OUT_MSG_ERROR   : '' ,
  //         CONFIG_OUT_MSG_EXITO   : ''
  //       },
  //     };
  //   //  console.log('VAOR_VACA', this.asigObservacionForm.value , parametro);
  //   this.scoreService.agregarPeriodoVacaciones(parametro).subscribe((resp: any) => {
  //   this.spinner.hide();

  //     Swal.fire({
  //       title: 'Planificar vacaciones!',
  //       text : `La vacación fue planificado con éxito`,
  //       icon : 'success',
  //       confirmButtonText: 'Ok',
  //     });

  //     this.close(true);
  //   });
  // }




  // actualizarPeriodo() {
  //   this.spinner.show();

  //   const formValues = this.asigObservacionForm.getRawValue();
  //   console.log('EST', this.asigObservacionForm.value);

  //   let parametro: any[] = [{ queryId: 131,
  //       mapValue: {
  //         p_idPeriodoVac         : this.DATA_SCORE.id_periodo,
  //         p_id_vacaciones        : this.DATA_SCORE.id_vacaciones ,
  //         p_id_persona           : this.DATA_SCORE.id_persona ,
  //         p_fecha_per_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
  //         p_fecha_per_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
  //         p_id_per_estado        : formValues.id_estado ,
  //         p_id_per_motivo        : formValues.id_motivo ,
  //         p_observacion          : formValues.observaciones ,
  //         p_id_usuario_asignacion: this.userID ,
  //         p_fecha_per_creacion   : '' ,
  //         p_id_sist_vac          : this.DATA_SCORE.id_sist,
  //         p_jira                 : formValues.jira?  1: 0 ,
  //         // p_jira                 : formValues.jira && this.esEstadoCompletado()?  1: 0 ,
  //         p_dedicaciones         : formValues.dedicaciones? 1: 0 ,
  //         CONFIG_USER_ID         : this.userID,
  //         CONFIG_OUT_MSG_ERROR: '',
  //         CONFIG_OUT_MSG_EXITO: ''
  //       },
  //     }];
  //    this.scoreService.actualizarPeriodo(parametro[0]).subscribe({next: (res) => {
  //       this.spinner.hide();
  //       this.cargarPeriodosByID();

  //       this.close(true)
  //         Swal.fire({
  //           title: 'Actualizar periodo!',
  //           text : `El Periodo fue actualizado con éxito`,
  //           icon : 'success',
  //           confirmButtonText: 'Ok'
  //           });

  //         this.asigObservacionForm.reset();
  //         this.dialogRef.close('Actualizar');
  //       }, error:()=>{
  //         Swal.fire(
  //           'ERROR',
  //           'No se pudo actualizar el periodo',
  //           'warning'
  //         );
  //       }
  //    });
  // }

  estadoInicial: any;
  titleBtn: string = 'Actualizar';
  cargarPeriodosByID(){
    if (!this.DATA_SCORE.isCreation) {
      this.titleBtn = 'Actualizar'
      this.asigObservacionForm.controls['id_motivo'    ].setValue(this.DATA_SCORE.id_per_motivo);
      this.asigObservacionForm.controls['id_estado'    ].setValue(this.DATA_SCORE.id_per_estado);

      this.estadoInicial = this.DATA_SCORE.id_per_estado;

      this.asigObservacionForm.controls['jira'         ].setValue(this.DATA_SCORE.jira);
      this.asigObservacionForm.controls['dedicaciones' ].setValue(this.DATA_SCORE.dedicaciones);
      this.asigObservacionForm.controls['observaciones'].setValue(this.DATA_SCORE.observacion);
      this.asigObservacionForm.controls['dias_periodo' ].setValue(this.DATA_SCORE.cant_dias_periodo);

      if (this.DATA_SCORE.fecha_inicio !='null' && this.DATA_SCORE.fecha_inicio != '') {
          let fecha_x = this.DATA_SCORE.fecha_inicio
          const str   = fecha_x.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.asigObservacionForm.controls['fechaInicio'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }

      if (this.DATA_SCORE.fecha_fin !='null' && this.DATA_SCORE.fecha_fin != '') {
        let fecha_x = this.DATA_SCORE.fecha_fin
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.asigObservacionForm.controls['fechaFin'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
    } else {
    // this.asigObservacionForm.controls['destinatario' ].setValue(this.DATA_SCORE.vacForm.correo);
    // this.setearMsjAobligatorio();

    console.log('DATOS', this.asigObservacionForm.value);
    }
  }

  listEstadoDetalle: any[] = [];
  getListEstadoDetalle(){
    let parametro: any[] = [{ queryId: 62 }];

    this.scoreService.getListEstadoDetalle(parametro[0]).subscribe((resp: any) => {
      this.listEstadoDetalle = resp.list;
      console.log('ESTADOS_DETALLE', resp.list);
    });
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

