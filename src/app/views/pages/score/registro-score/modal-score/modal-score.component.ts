import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-modal-evento',
  templateUrl: './modal-score.component.html',
  styleUrls: ['./modal-score.component.scss']
})
export class ModalStoreComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  scoreForm!: FormGroup;
  iniciativa_Id = this.DATA_SCORE.idScoreM

  page = 1;
  totalScore: number = 0;
  pageSize = 10;

  usuario: any;
  loadingItem: boolean = false;
  userID: number = 0;

  constructor(
    private scoreService: ScoreService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<ModalStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE: any
  ) {
    // this.usuario = JSON.parse(localStorage.getItem('currentUser')
  }

  ngOnInit(): void {
    this.newFilfroForm();

    this.cargarOBuscarScoreDetalle();
    this.cargarSCoreByID();
    this.getUsuario();
    this.getListEstado();

    this.ListaHistoricoCambios(this.DATA_SCORE);

    console.log('DATA_SCORE', this.DATA_SCORE);
    console.log('DATA_SCORE_ID', this.DATA_SCORE.idScoreM);
    // console.log('FECHA_INCIO', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    console.log('HORA_X', formatDate(new Date(), 'hh:mm', 'en-US', ''));
    }

    newFilfroForm(){
      this.scoreForm = this.fb.group({
        num_doc        : [''],
        id_estado_m    : [''],
        id_estado_d    : [''],
        fecha_proceso  : [''],
        solicitante    : [''],

        id_score       : [''],
        id_estado      : [''],
        fecha_envio    : [''],
        fecha_solicitud: [''],

        id_envio       : [''],
        observacion    : [''],
      })
    }

  listScoreDetalle: any[] = [];
  cargarOBuscarScoreDetalle(){
    this.blockUI.start("Cargando Score...");
    let parametro: any[] = [{
      "queryId": 56,
      "mapValue": {
          p_idScore     : this.DATA_SCORE.idScoreM,
          p_creado_por  : this.scoreForm.value.num_doc,
          p_id_estado   : this.scoreForm.value.id_estado_d,
          p_solicitante : this.scoreForm.value.solicitante,
          inicio        : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_ini,"yyyy/MM/dd"),
          fin           : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_fin,"yyyy/MM/dd"),
      }
    }];
    this.scoreService.cargarOBuscarScoreDetalle(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-score_DX', resp, resp.list.length);
      this.listScoreDetalle = [];
      this.listScoreDetalle = resp.list;

      this.spinner.hide();
    });
  }

  crearOactualizarScore() {
    this.spinner.show();

    if (!this.DATA_SCORE) {
      if (this.scoreForm.valid) {
        // this.crearEvento()
      }
    } else {
      this.actualizarScore();
      // this.cargarSCoreByID();
    }
    this.spinner.hide();
  }

   actualizarScore(){
    this.spinner.show();

    const formValues = this.scoreForm.getRawValue();

    let parametro: any[] = [{
        queryId: 27,
        mapValue: {
          p_id_registro            : this.DATA_SCORE.idreg ,
          p_id_tipoEvento          : formValues.tipo_evento ,
          p_cdescripcion           : formValues.descripcion ,
          p_estado                 : formValues.estado ,
          p_motivo                 : formValues.motivo ,
          p_aplicacion             : formValues.aplicacion ,
          p_hora_deteccion         : formValues.h_deteccion ,
          p_fecha_inicio           : formValues.fecha_inicio ,
          p_hora_inicio            : formValues.h_inicio ,
          p_hora_fin               : formValues.h_fin ,
          p_fecha_fin              : formValues.fecha_fin ,
          p_hora_notificacion      : formValues.h_notificacion ,
          p_modo                   : formValues.modo_notificacion ,
          p_destinatario           : formValues.destinatario ,
          p_cantidad               : formValues.servicios ,
          p_codigo_ticket_generado : formValues.ticket_generado ,
          p_hora_generacion        : formValues.h_generacion ,
          p_estic                  : formValues.estado_ticket ,
          p_prioridad              : formValues.prioridad ,
          p_area                   : formValues.area_responsable ,
          p_fecha_resolucion       : formValues.fecha_resolucion ,
          p_hora_resolucion        : formValues.h_solucion ,
          p_pbi                    : formValues.pbi ,
          p_eta_pbi                : formValues.eta_pbi ,
          p_comentariosgenerales   : formValues.comentarios ,
          p_medidas_correctivas    : formValues.medidas_correctivas ,
          p_notas                  : formValues.motivo_notas ,
          p_fecha_actualizacion    : '' ,
          p_user_actualizacion     : this.userID ,
          CONFIG_USER_ID           : this.userID ,
          CONFIG_OUT_MSG_ERROR : '' ,
          CONFIG_OUT_MSG_EXITO : ''
        },
      }];

    this.scoreService.actualizarScore(parametro[0]).subscribe( {next: (resp: any) => {
      this.spinner.hide();

      // console.log('DATA_ACTUALIZADO', resp);
      // this.cargarSCoreByID();
      this.dialogRef.close('Actualizar')

      Swal.fire({
        title: 'Actualizar Score!',
        text : `Score:  ${this.DATA_SCORE.cod_evento }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    }, error: () => {
      Swal.fire(
        'ERROR',
        'No se pudo actualizar el Score',
        'warning'
      );
    }});
  };

  actionBtn: string = 'Registrar';
  cargarSCoreByID(){
    if (this.DATA_SCORE) {
    this.actionBtn = 'Actualizar'
      this.scoreForm.controls['id_score'   ].setValue(this.DATA_SCORE.idScoreM );
      this.scoreForm.controls['solicitante'].setValue(this.DATA_SCORE.solicitante);
      this.scoreForm.controls['id_estado_m'].setValue(this.DATA_SCORE.idEstado);
      // this.scoreForm.controls['id_estado'  ].setValue(this.DATA_SCORE.idEstado);
      this.scoreForm.controls['observacion'].setValue(this.DATA_SCORE.observacion);
      this.scoreForm.controls['id_envio'  ].setValue(this.DATA_SCORE.idEnvio);

      if (this.DATA_SCORE.fecha_solicitud) {
        let fecha_x = this.DATA_SCORE.fecha_solicitud
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.scoreForm.controls['fecha_solicitud'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }

      if (this.DATA_SCORE.fecha_envio) {
        let fecha_x = this.DATA_SCORE.fecha_envio
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.scoreForm.controls['fecha_envio'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
    }
  }


  campoNoValido(campo: string): boolean {
    if ( this.scoreForm.get(campo)?.invalid && this.scoreForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }


  listHistoricoCambios: any[] = [];
  ListaHistoricoCambios(idRegistro:number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 56,
      "MapValue": {
        "p_idRegistro": this.DATA_SCORE.idreg
      }
    }];
    this.scoreService.ListaHistoricoCambios(parametro[0]).subscribe((resp: any) => {
      this.listHistoricoCambios = resp.list;
     console.log("listHistorico", resp.list);
      this.spinner.hide();
    });
  }

  listEstado: any[] = [];
  getListEstado(){
    let parametro: any[] = [{ queryId: 58 }];

    this.scoreService.getListEstado(parametro[0]).subscribe((resp: any) => {
      this.listEstado = resp.list;
      console.log('ESTADOS', resp.list);
    });
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

   limpiarFiltro() {
    this.scoreForm.reset('', {emitEvent: false})
    this.newFilfroForm();

    this.cargarOBuscarScoreDetalle();
  };


   listPageDisp: any[] = [];
   totalfiltro = 0;
   cambiarPagina(event: number) {
     let offset = event*10;
     this.spinner.show();

     if (this.totalfiltro != this.totalScore) {
       this.scoreService.cargarOBuscarScoreDetalle(offset.toString()).subscribe( (resp: any) => {
             this.listPageDisp = resp.list;
             this.spinner.hide();
           });
     } else {
       this.spinner.hide();
     }
       this.page = event;
   }


  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
