import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


export class Usuario {
  id!: number;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  user:any;
}

@Component({
  selector: 'app-modal-evento',
  templateUrl: './modal-score.component.html',
  styleUrls: ['./modal-score.component.scss']
})
export class ModalScoreComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  scoreForm!: FormGroup;

  page = 1;
  totalScore: number = 0;
  pageSize = 5;

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
    private dialogRef: MatDialogRef<ModalScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_EVENTO: any
  ) {
    // this.usuario = JSON.parse(localStorage.getItem('currentUser')
  }

  ngOnInit(): void {
    this.newFilfroForm();
    // this.cargarEventoByID();
    this.cargarOBuscarScoreDetalle();
    this.getUsuario();
    this.getListEstado();

    this.ListaHistoricoCambios(this.DATA_EVENTO);

    console.log('DATA_EVENTO', this.DATA_EVENTO);
    console.log('DATA_EVEN_ESTADO_TICKET', this.DATA_EVENTO.tipo_evento);
    console.log('DATA_EVEN_COD_EVENTO', this.DATA_EVENTO.cod_evento);
    // console.log('FECHA_INCIO', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    console.log('HORA_X', formatDate(new Date(), 'hh:mm', 'en-US', ''));
    }

    newFilfroForm(){
      this.scoreForm = this.fb.group({
        num_doc     : [''],
        id_estado_d   : [''],
        fecha_proceso : [''],


        id_score: [''],
        id_estado: [''],
        fecha_envio: [''],


        motivos: [''],
        comentarios: [''],
      })
    }

  listScoreDetalle: any[] = [];
  cargarOBuscarScoreDetalle(){
    this.blockUI.start("Cargando Score...");
    let parametro: any[] = [{
      "queryId": 56,
      "mapValue": {
          p_creado_por  : this.scoreForm.value.num_doc,
          p_id_estado   : this.scoreForm.value.id_estado,
          p_solicitante : this.scoreForm.value.solicitante,
          inicio        : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_ini,"yyyy/MM/dd"),
          fin           : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_fin,"yyyy/MM/dd"),
      }
    }];
    this.scoreService.cargarOBuscarScoreDetalle(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-score_D', resp, resp.list.length);
      this.listScoreDetalle = [];
      this.listScoreDetalle = resp.list;

      this.spinner.hide();
    });
  }

  crearOactualizarEvento() {
    this.spinner.show();

    if (!this.DATA_EVENTO) {
      if (this.scoreForm.valid) {
        // this.crearEvento()
      }
    } else {
      this.actualizarEvento();
      // this.cargarEventoByID();
    }
    this.spinner.hide();
  }


   actualizarEvento(){
    this.spinner.show();

    const formValues = this.scoreForm.getRawValue();

    let parametro: any[] = [{
        queryId: 27,
        mapValue: {
          p_id_registro            : this.DATA_EVENTO.idreg ,
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
      // this.cargarEventoByID();
      this.dialogRef.close('Actualizar')

      Swal.fire({
        title: 'Actualizar Score!',
        text : `Score:  ${this.DATA_EVENTO.cod_evento }, actualizado con éxito`,
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
  // cargarEventoByID(){
  //   if (this.DATA_EVENTO) {
  //   this.actionBtn = 'Actualizar'
  //     this.scoreForm.controls['cod_evento'         ].setValue(this.DATA_EVENTO.cod_evento);
  //     this.scoreForm.controls['tipo_evento'        ].setValue(this.DATA_EVENTO.id_tipo_evento);
  //     this.scoreForm.controls['prioridad'          ].setValue(this.DATA_EVENTO.id_prioridad);
  //     this.scoreForm.controls['descripcion'        ].setValue(this.DATA_EVENTO.descripcion);
  //     this.scoreForm.controls['estado'             ].setValue(this.DATA_EVENTO.id_estado);
  //     this.scoreForm.controls['motivo'             ].setValue(this.DATA_EVENTO.id_motivo);
  //     this.scoreForm.controls['aplicacion'         ].setValue(this.DATA_EVENTO.id_aplicacion );
  //     this.scoreForm.controls['servicios'          ].setValue(this.DATA_EVENTO.cantidad );
  //     this.scoreForm.controls['h_deteccion'        ].setValue(this.DATA_EVENTO.hora_deteccion);
  //     this.scoreForm.controls['h_inicio'           ].setValue(this.DATA_EVENTO.hora_inicio);
  //     this.scoreForm.controls['modo_notificacion'  ].setValue(this.DATA_EVENTO.id_modonotificacion);
  //     this.scoreForm.controls['h_notificacion'     ].setValue(this.DATA_EVENTO.hora_notificacion);
  //     this.scoreForm.controls['destinatario'       ].setValue(this.DATA_EVENTO.destinatario );
  //     this.scoreForm.controls['h_fin'              ].setValue(this.DATA_EVENTO.hora_fin);
  //     this.scoreForm.controls['ticket_generado'    ].setValue(this.DATA_EVENTO.codigo_ticket_generado);
  //     this.scoreForm.controls['h_generacion'       ].setValue(this.DATA_EVENTO.hora_generacion);
  //     this.scoreForm.controls['estado_ticket'      ].setValue(this.DATA_EVENTO.id_estadoticket);
  //     this.scoreForm.controls['area_responsable'   ].setValue(this.DATA_EVENTO.id_area_responsable);
  //     this.scoreForm.controls['h_solucion'         ].setValue(this.DATA_EVENTO.hora_resolucion);
  //     this.scoreForm.controls['pbi'                ].setValue(this.DATA_EVENTO.pbi );
  //     this.scoreForm.controls['eta_pbi'            ].setValue(this.DATA_EVENTO.eta_pbi);
  //     this.scoreForm.controls['motivo_notas'       ].setValue(this.DATA_EVENTO.notas );
  //     this.scoreForm.controls['comentarios'        ].setValue(this.DATA_EVENTO.comentariosgenerales);
  //     this.scoreForm.controls['medidas_correctivas'].setValue(this.DATA_EVENTO.medidas_correctivas);

  //     if (this.DATA_EVENTO.f_fin) {
  //       let fecha_x = this.DATA_EVENTO.f_fin
  //       const str   = fecha_x.split('/');
  //       const year  = Number(str[2]);
  //       const month = Number(str[1]);
  //       const date  = Number(str[0]);
  //       this.scoreForm.controls['fecha_fin'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
  //     }

  //     if (this.DATA_EVENTO.f_inicio) {
  //       let fecha_x = this.DATA_EVENTO.f_inicio
  //       const str   = fecha_x.split('/');
  //       const year  = Number(str[2]);
  //       const month = Number(str[1]);
  //       const date  = Number(str[0]);
  //       this.scoreForm.controls['fecha_inicio'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
  //     }

  //     if (this.DATA_EVENTO.f_resolucion) {
  //       let fecha_x = this.DATA_EVENTO.f_resolucion
  //       const str   = fecha_x.split('/');
  //       const year  = Number(str[2]);
  //       const month = Number(str[1]);
  //       const date  = Number(str[0]);
  //       this.scoreForm.controls['fecha_resolucion'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
  //     }
  //   }
  // }


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
      "queryId": 47,
      "MapValue": {
        "p_idRegistro": this.DATA_EVENTO.idreg
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
    let parametro: any[] = [{ queryId: 35 }];

    this.scoreService.getListEstado(parametro[0]).subscribe((resp: any) => {
      this.listEstado = resp.list;
     //  console.log('ESTADOS', resp.list);
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
