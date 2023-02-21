import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ROLES_ENUM } from 'src/app/core/constants/rol.constants';

@Component({
  selector: 'app-modal-evento',
  templateUrl: './modal-score.component.html',
  styleUrls: ['./modal-score.component.scss']
})
export class ModalStoreComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  scoreForm!: FormGroup;

  score_Id!: number;

  page = 1;
  totalScore: number = 0;
  pageSize = 10;

  usuario: any;
  loadingItem: boolean = false;
  userID: number = 0;

  constructor(
    private scoreService: ScoreService,
    public authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<ModalStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE: any
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();

    this.isGestorTDP();
    this.getUsuario();
    this.getListEstado();
    this.getListEstadoDetalle();
    if (this.DATA_SCORE && this.DATA_SCORE.idScoreM){
        this.score_Id = this.DATA_SCORE.idScoreM

        this.cargarOBuscarScoreDetalle();
        this.ListaHistoricoCambios(this.DATA_SCORE);
        this.cargarSCoreByID();

    }


    console.log('DATA_SCORE', this.DATA_SCORE);
    // console.log('DATA_SCORE_ID', this.DATA_SCORE.idScoreM);
    // console.log('FECHA_INCIO', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    console.log('HORA_X', formatDate(new Date(), 'hh:mm', 'en-US', ''));
    }


    newFilfroForm(){
      this.scoreForm = this.fb.group({
        solicitante    : [''],
        id_estado_m    : [''],
        id_score       : [''],
        fecha_envio    : [''],
        fecha_solicitud: [''],
        // user_crea      : [""],
        id_envio       : [''],
        observacion    : [''],

        fecha_proceso  : [''],
        num_doc        : [''],
        id_estado_d    : [''],

      })
    }


    rolGestorTdp: number = 0;
    isGestorTDP(){
      // this.authService.getRolID().suscribe( (resp: any) => {
      //    this.rolGestorTdp = resp.user.rolId

      //   console.log('ID_ROL_TDP', this.rolGestorTdp);
      // })

      this.rolGestorTdp = this.authService.getRolID();
        console.log('ID_ROL_TDP', this.rolGestorTdp);
    };

    validarIfIsGestor(){
      if (!this.authService.esUsuarioGestor()) {
        this.scoreForm.controls['id_estado_m'].disable()
        this.scoreForm.controls['id_envio'   ].disable()
      }
    }

    listScoreDetalle: any[] = [];
    cargarOBuscarScoreDetalle(){
      this.blockUI.start("Cargando Score detalle...");
      let parametro: any[] = [{
        "queryId": 56,
        "mapValue": {
            p_idScore     : this.DATA_SCORE.idScoreM,
            p_num_doc     : this.scoreForm.value.num_doc,
            p_id_estado   : this.scoreForm.value.id_estado_d,
            p_fecha_proc  : this.scoreForm.value.fecha_proceso,
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

  crearOactualizarScore() {
    this.spinner.show();

    if (!this.DATA_SCORE) {
      if (this.scoreForm.valid) {
        this.crearScoreM()
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
        queryId: 59,
        mapValue: {
          p_idScoreM           : this.DATA_SCORE.idScoreM,
          p_solicitante        : formValues.solicitante,
          p_fecha_solicitud    : formValues.fecha_solicitud,
          p_fecha_envio        : formValues.fecha_envio,
          p_idEstado           : formValues.id_estado_m,
          p_Actualiza          : 'Jhon S',
          p_FActualiza         : '',
          p_observacion        : formValues.observacion,
          p_idEnvio            : formValues.id_envio,

          CONFIG_USER_ID       : this.userID ,
          CONFIG_OUT_MSG_ERROR : '' ,
          CONFIG_OUT_MSG_EXITO : ''
        },
      }];

    this.scoreService.actualizarScore(parametro[0]).subscribe( {next: (resp: any) => {
      this.spinner.hide();

      console.log('DATA_ACTUALIZADO', resp);
      // this.cargarSCoreByID();
      this.dialogRef.close('Actualizar')

        Swal.fire({
          title: 'Actualizar Score!',
          text : `Score:  ${this.DATA_SCORE.idScoreM }, actualizado con éxito`,
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

  crearScoreM(){
    const formValues = this.scoreForm.getRawValue();
    let parametro: any =  {
        queryId: 61,
        mapValue: {
          p_solicitante     : formValues.solicitante,
          p_fecha_solicitud : formValues.fecha_solicitud,
          p_fecha_envio     : formValues.fecha_envio,
          p_idEstado        : 1, //ESTADO SOLICITADO,
          p_Crea            : formValues.user_crea, // Varchar(50)
          p_FCrea           : formValues.f_crea,
          // p_fecha_creacion: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          CONFIG_USER_ID       : this.userID,
          CONFIG_OUT_MSG_ERROR : '',
          CONFIG_OUT_MSG_EXITO : ''
        },
      };

      console.log('VAOR', this.scoreForm.value , parametro);
      this.scoreService.crearScore(parametro).subscribe((resp: any) => {
        console.log('INSERT_SCORE_M', resp);

        Swal.fire({
          title: 'Crear Score!',
          text: `Score, creado con éxito`,
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      });
    }

  actionBtn: string = 'Agregar';
  cargarSCoreByID(){
    this.actionBtn = 'Actualizar'
      this.scoreForm.controls['id_score'   ].setValue(this.DATA_SCORE.idScoreM );
      this.scoreForm.controls['solicitante'].setValue(this.DATA_SCORE.solicitante);
      this.scoreForm.controls['id_estado_m'].setValue(this.DATA_SCORE.idEstado);
      this.scoreForm.controls['observacion'].setValue(this.DATA_SCORE.observacion);
      this.scoreForm.controls['id_envio'   ].setValue(this.DATA_SCORE.idEnvio);

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

      this.validarIfIsGestor();
  }

  listHistoricoCambios: any[] = [];
  ListaHistoricoCambios(idRegistro: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 60,
      "MapValue": {
        "p_idhistorico": this.DATA_SCORE.idScoreM
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

  listEstadoDetalle: any[] = [];
  getListEstadoDetalle(){
    let parametro: any[] = [{ queryId: 62 }];

    this.scoreService.getListEstadoDetalle(parametro[0]).subscribe((resp: any) => {
      this.listEstadoDetalle = resp.list;
      console.log('ESTADOS_DETALLE', resp.list);
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

    // hasPermission(r: ROLES_ENUM[]): boolean {
    //   if (r) {
    //     return this.authService.accesoBtnMail(r)
    //   }
    //   return true;
    // }

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
