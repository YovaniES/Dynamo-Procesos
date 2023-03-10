import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScoreService } from 'src/app/core/services/score.service';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AsignarObservacionComponent } from './asignar-observacion/asignar-observacion.component';
import * as XLSX from 'xlsx';
import { ScoreDetalleService } from 'src/app/core/services/score-detalle.service';
import { ScoreDetalle } from 'src/app/core/models/scored.models';
import { mapearListadoDetalleScore } from 'src/app/core/mapper/detalle-score.mapper';
import { concatMap, of } from 'rxjs';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';

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
  userName: string = '';

  constructor(
    private scoreService: ScoreService,
    public authService: AuthService,
    private scoreDetalleService: ScoreDetalleService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalStoreComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE: any
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.isGestorTDP();
    this.getUsername();
    this.getUserID();
    this.getListEstado();
    this.getListEstadoDetalle();
    this.getListFormatoEnvio();
    this.getListHorarioEnvio();
    if (this.DATA_SCORE && this.DATA_SCORE.idScoreM){
        this.score_Id = this.DATA_SCORE.idScoreM

        this.cargarOBuscarScoreDetalle();
        this.ListaHistoricoCambios(this.DATA_SCORE);
        this.cargarSCoreByID();
    }
    console.log('DATA_SCORE', this.DATA_SCORE);
    // console.log('DATA_SCORE_ID', this.DATA_SCORE.idScoreM);
    }


    newFilfroForm(){
      this.scoreForm = this.fb.group({
        solicitante    : [''],
        // id_estado_m    : [''],
        id_estado_m    : [{value: '', disabled: true}],
        id_score       : [''],
        fecha_envio    : ['', Validators.required],
        fecha_solicitud: [''],
        id_hor_envio   : ['', Validators.required],
        id_form_envio  : [''],
        observacion    : [''],
        fecha_proceso  : [''],
        num_doc        : [''],
        id_estado_d    : [''],
        version        : [''],
        importar       : [''],
        actualiza      : ['']
      })
    }

    scoreDataImport: any;
    readExcell(e: any){
      this.blockUI.start("Espere por favor, estamos Importando la Data a la Base de Datos...");

      this.spinner.show();
      let file = e.target.files[0];
      let fileReader = new FileReader();

      fileReader.readAsBinaryString(file)

      fileReader.onload = e => {
        var wb = XLSX.read(fileReader.result, { type: 'binary', cellDates: true})
        var sheetNames = wb.SheetNames;

        this.scoreDataImport = XLSX.utils.sheet_to_json(wb.Sheets[sheetNames[0]])

        console.log('DATA_EXCELL-IMPORTADO', this.scoreDataImport);
        // this.spinner.hide();
        this.insertarListadoDetalleScore();
        this.blockUI.stop();
      }
    }

    insertarListadoDetalleScore(){
      this.spinner.show();
      let parametro: any[] = this.mapearScore(true);

      const listScoreDetalle: ScoreDetalle[] = mapearListadoDetalleScore(this.scoreDataImport, this.DATA_SCORE.idScoreM, this.scoreForm.controls['version'].value )

      this.scoreService.actualizarScore(parametro[0]).pipe(
        concatMap((resp: any) => {
               return resp && resp.exitoMessage == 'Actualizaci??n exitosa'? this.scoreDetalleService.insertarListadoDetalleScore(listScoreDetalle): of({})
        })
      ).subscribe((resp: any) => {
          console.log('ABC', resp);

        if( resp && resp.message == 'ok'){

          //Seteamos la version del Score_m,
          this.scoreForm.controls['version'].setValue(this.DATA_SCORE.version + 1);

          Swal.fire({
            title: 'Importar Score!',
            text : `Se import?? con ??xito la data`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

            this.spinner.hide();
            this.actualizarScoreD();

            this.cargarOBuscarScoreDetalle();
        }
        console.log('DATA_SCORE_DETALLE', resp);
      })
    }

    listScoreDetalle: any[] = [];
    cargarOBuscarScoreDetalle(){
      this.listScoreDetalle = [];

      this.blockUI.start("Cargando Score detalle...");
      let parametro: any[] = [{
        "queryId": 1,
        "mapValue": {
            p_idScore   : this.DATA_SCORE.idScoreM,
            p_num_doc   : this.scoreForm.value.num_doc,
            p_id_estado : this.scoreForm.value.id_estado_d,
            p_fecha_proc: this.scoreForm.value.fecha_proceso,
            inicio      : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_ini,"yyyy/MM/dd"),
            fin         : this.datepipe.transform(this.scoreForm.value.fecha_solicitud_fin,"yyyy/MM/dd"),
        }
      }];
      this.scoreService.cargarOBuscarScoreDetalle(parametro[0]).subscribe((resp: any) => {
      this.blockUI.stop();

       console.log('D A T A - score_D', resp, resp.list.length);
       if (!this.authService.esUsuarioGestor()) {
         this.listScoreDetalle = resp.list;

       } else {
         this.listScoreDetalle = resp.list.filter( (score: any) => score.id_estado != 4);
       }

        this.spinner.hide();
      });
    }



  get existeRegistros():boolean{
    return this.listScoreDetalle.length == 0;
  }

  cambiarEstadoScoreM(nombreEstado: string){
    console.log(this.listEstado)
    const estadoSolicitado = this.buscarEstadoPorNombre(nombreEstado);

    if (estadoSolicitado) {
      // this.actualizarScore(estadoSolicitado.idEstado)

      Swal.fire({
        title: '??Cambiar estado?',
        text: `??Estas seguro que deseas cambiar el estado ?`,
        icon: 'question',
        confirmButtonColor: '#ec4756',
        cancelButtonColor: '#3cd8aa',
        confirmButtonText: 'Si, Cambiar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.cambiarEstadoDetalleAenviado();
          // this.exportScoreDetalle(this.DATA_SCORE.idScoreM); // exportamos el score_d
          this.actualizarScore(estadoSolicitado.idEstado);
        }
      });
    }
  }

  buscarEstadoPorNombre(nombreEstado:string): any{
    return this.listEstado.find(estado => estado.cNombre.toUpperCase() == nombreEstado);
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

  mapearScore(incrementarVersion: boolean = false, idEstado?:number): any[]{
    const formValues = this.scoreForm.getRawValue();

    return  [{
      queryId: 4,
      mapValue: {
        p_idScoreM           : this.DATA_SCORE.idScoreM,
        p_solicitante        : formValues.solicitante,
        p_fecha_solicitud    : formValues.fecha_solicitud,
        p_fecha_envio        : formValues.fecha_envio,
        p_idEstado           : idEstado? idEstado: formValues.id_estado_m,
        p_actualiza          : this.userName,
        p_f_actualiza        : '',
        p_observacion        : formValues.observacion,
        p_idEnvio            : formValues.id_form_envio,
        p_item_version       : incrementarVersion? formValues.version +1 : formValues.version,
        p_item_hora_envio    : formValues.id_hor_envio,
        CONFIG_USER_NAME     : this.userName ,
        CONFIG_OUT_MSG_ERROR : '' ,
        CONFIG_OUT_MSG_EXITO : ''
      },
    }];
  }

  actualizarScore(estadoScore?: number){
    this.spinner.show();
    let parametro: any[] = this.mapearScore(false, estadoScore);

    this.scoreService.actualizarScore(parametro[0]).subscribe( {next: (resp: any) => {
      this.spinner.hide();

      console.log('DATA_ACTUALIZADO', resp);
      // this.cargarSCoreByID();
      if (!estadoScore) {
        this.dialogRef.close('Actualizar')

      }else{
        this.actualizarScoreD();
        this.listScoreM_ByID();
        // Atualizamos el SCORE_D
      }

        Swal.fire({
          title: 'Actualizar Score!',
          text : `Score:  ${this.DATA_SCORE.idScoreM }, actualizado con ??xito`,
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

  listScoreM_ByID(){
    let parametro: any =  {
        queryId: 20,
        mapValue: {
          p_idScoreM: this.DATA_SCORE.idScoreM
        },
      };

      this.scoreService.listScoreM_ByID(parametro).subscribe( {next: (resp: any) => {
      this.scoreForm.controls['id_estado_m'].setValue(resp.list[0].idEstado);

        // this.actualizarScoreD()
        // console.log('SCORE_M_BY_ID', resp.list);
      }});
    }

      // exportarRegistro(id: number){
  //   this.exportScoreDetalle(id)
  //   };

  listScoreDetalleImport: any[] = [];
  exportScoreDetalle(id_score: number){
    let parametro: any[] = [{
      "queryId": 23,
      "mapValue": {
          p_idScore : id_score,
      }
    }];
    this.scoreService.exportScoreDetalle(parametro[0]).subscribe((resp: any) => {
      this.listScoreDetalleImport = resp.list;

    this.exportExcellService.exportarExcel(this.listScoreDetalleImport, 'Score');
    });
  }

cambiarEstadoDetalleAenviado(){
  let parametro: any[] = [{ queryId: 22,
    mapValue: {
      p_idScore      : this.DATA_SCORE.idScoreM,
    },
  }];

  this.scoreService.actualizarScoreD(parametro[0]).subscribe( {next: (resp: any) => {
    // this.cargarOBuscarScoreDetalle(); <============================
    this.actualizarScoreD(); //OJO CAMBIARMOS EL ESTADO DEL SCORE_D
    // this.exportScoreDetalle(this.DATA_SCORE.idScoreM); // <=================

  }});
};

    actualizarScoreD(){
      const formValues = this.scoreForm.getRawValue();
      let parametro: any =  {
          queryId: 24,
          mapValue: {
            v_idscore    : this.DATA_SCORE.idScoreM,
            v_idversion  : this.DATA_SCORE.version + 1,
          },
        };

        this.scoreService.actualizarScoreD(parametro).subscribe((resp: any) => {
          console.log('UPDATE_SCORE_D', resp);

        this.cargarOBuscarScoreDetalle();
        });
      }

  crearScoreM(){
    const formValues = this.scoreForm.getRawValue();
    let parametro: any =  {
        queryId: 6,
        mapValue: {
          p_solicitante        : this.userName, //Username: usuario logueado a la web
          p_fecha_solicitud    : formValues.fecha_solicitud,
          p_fecha_envio        : formValues.fecha_envio,
          p_idEstado           : 1, //ESTADO REGISTRADO,
          p_crea_solic         : this.userName,
          p_f_crea             : formValues.f_crea,
          p_idEnvio            : formValues.id_hor_envio,
          p_item_version       : '',
          p_item_hora_envio    : formValues.id_form_envio,
          CONFIG_USER_NAME       : this.userName,
          CONFIG_OUT_MSG_ERROR : '',
          CONFIG_OUT_MSG_EXITO : ''
        },
      };

      console.log('VAOR', this.scoreForm.value , parametro);
      this.scoreService.crearScore(parametro).subscribe((resp: any) => {
        console.log('INSERT_SCORE_M', resp);

        Swal.fire({
          title: 'Crear Score!',
          text: `Score, creado con ??xito`,
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.close(true);
      });
    }


  actionBtn: string = 'Agregar';
  cargarSCoreByID(){
    this.actionBtn = 'Actualizar'
      this.scoreForm.controls['id_score'     ].setValue(this.DATA_SCORE.idScoreM );
      this.scoreForm.controls['solicitante'  ].setValue(this.DATA_SCORE.solicitante);
      this.scoreForm.controls['id_estado_m'  ].setValue(this.DATA_SCORE.idEstado);
      this.scoreForm.controls['observacion'  ].setValue(this.DATA_SCORE.observacion);
      this.scoreForm.controls['id_hor_envio' ].setValue(this.DATA_SCORE.idEnvio);
      this.scoreForm.controls['actualiza'    ].setValue(this.DATA_SCORE.actualiza);
      this.scoreForm.controls['id_form_envio'].setValue(this.DATA_SCORE.item_hora_envio);
      this.scoreForm.controls['version'      ].setValue(this.DATA_SCORE.version);

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

      this.validateIfIsSolicitante();

      if (this.scoreForm.controls['id_estado_m'].value != 1) {

        this.validarIfIsGestor();
      }
  }

  rolGestorTdp: number = 0;
  isGestorTDP(){
    this.rolGestorTdp = this.authService.getRolID();
      console.log('ID_ROL_TDP', this.rolGestorTdp);
  };


  disabledControls(){
      this.scoreForm.controls['id_hor_envio' ].disable()
      this.scoreForm.controls['id_form_envio'].disable()
      this.scoreForm.controls['fecha_envio'  ].disable()
  }

  validarIfIsGestor(){
    if (!this.authService.esUsuarioGestor() ) {
      this.disabledControls();
    }
  }

  validateIfIsSolicitante(){
    if (!this.authService.esUsuarioSolicitante()) {
      this.disabledControls();
      this.scoreForm.controls['importar'].disable()
    }
  }

  listHistoricoCambios: any[] = [];
  ListaHistoricoCambios(idRegistro: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 5,
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
    let parametro: any[] = [{ queryId: 3 }];

    this.scoreService.getListEstado(parametro[0]).subscribe((resp: any) => {
      this.listEstado = resp.list;
      // console.log('ESTADOS', resp.list);
    });
  }

  listEstadoDetalle: any[] = [];
  getListEstadoDetalle(){
    let parametro: any[] = [{ queryId: 7 }];

    this.scoreService.getListEstadoDetalle(parametro[0]).subscribe((resp: any) => {
      this.listEstadoDetalle = resp.list;
      // console.log('ESTADOS_DETALLE', resp.list);
    });
  }

  listFormEnvio: any[] = [];
  getListFormatoEnvio(){
    let parametro: any[] = [{ queryId: 16 }];

    this.scoreService.getListFormatoEnvio(parametro[0]).subscribe((resp: any) => {
      this.listFormEnvio = resp.list;
      // console.log('FORMATO_ENVIO', resp.list);
    });
  }

  listHorarioEnvio: any[] = [];
  getListHorarioEnvio(){
    let parametro: any[] = [{ queryId: 15 }];

    this.scoreService.getListHorarioEnvio(parametro[0]).subscribe((resp: any) => {
      this.listHorarioEnvio = resp.list;
      console.log('HORARIO_ENVIO', resp.list);
    });
  }


  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }


   getUsername(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userName = resp.userName
      this.scoreForm.controls['solicitante'].setValue(this.userName);
      console.log('USER_NAME', this.userName);
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

   validarCambioScoreM(resp: any ){
    if (resp.exitoMessage == "Actualizaci??n exitosa") {
      this.cambiarEstadoScoreM('EN VALIDACI??N');
    }
   }

   asignarObservacion(DATA: any){
    const dialogRef = this.dialog.open(AsignarObservacionComponent, { width:'35%', data: DATA });

    dialogRef.afterClosed().subscribe(resp => {
      console.log('CLOSE', resp);

      if (resp) {
        this.validarCambioScoreM(resp)

        this.cargarOBuscarScoreDetalle()
      }
    })
  };

  campoNoValido(campo: string): boolean {
    if (this.scoreForm.get(campo)?.invalid && this.scoreForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}


