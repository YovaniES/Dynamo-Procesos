import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ScoreService } from 'src/app/core/services/score.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalStoreComponent } from './modal-score/modal-score.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-registro-score',
  templateUrl: './registro-score.component.html',
  styleUrls: ['./registro-score.component.scss']
})
export class RegistroScoreComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userId!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalPersonal: number = 0;
  pageSize = 10;

  constructor(
    private scoreService: ScoreService,
    public authService: AuthService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarScoreM();
    this.getListEstado();
    this.getListFormatoEnvio();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      actualiza_por       : [''],
      solicitante         : [''],
      id_estado           : [''],
      fecha_solicitud_ini : [''],
      fecha_solicitud_fin : [''],
    })
  };

  listScore: any[] = [];
  cargarOBuscarScoreM(){
    this.blockUI.start("Cargando Score...");
    let parametro: any[] = [{
      "queryId": 2,
      "mapValue": {
          p_solicitante  : this.authService.getUserNameByRol(), // this.filtroForm.value.solicitante,
          p_actualiza_por: this.filtroForm.value.actualiza_por,
          p_id_estado    : this.filtroForm.value.id_estado,
          inicio         : this.datepipe.transform(this.filtroForm.value.fecha_solicitud_ini,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.filtroForm.value.fecha_solicitud_fin,"yyyy/MM/dd"),
      }
    }];
    this.scoreService.cargarOBuscarScoreM(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();
     console.log('Lista-score_m', resp, resp.list.length);
     console.log('DATA_SCORE_M**', resp.list.filter((x: any) => x.idEstado != 1) );


     if (this.authService.esUsuarioGestor()) {
       this.listScore = [];
      //  const dataScoreDifEstReg = resp.list.filter((x: any) => x.idEstado != 1)
       this.listScore= resp.list.filter((x: any) => x.idEstado != 1)
      //  this.listScore = resp.list;
      }else{
        this.listScore = resp.list;
      }

      this.spinner.hide();
    });
  };

  listScoreDetalle: any[] = [];
  cargarOBuscarScoreDetalle(id_score: number){
    let parametro: any[] = [{
      "queryId": 1,
      "mapValue": {
          p_idScore : id_score,
      }
    }];
    this.scoreService.cargarOBuscarScoreDetalle(parametro[0]).subscribe((resp: any) => {
      this.listScoreDetalle = resp.list;

    this.exportExcellService.exportarExcel(this.listScoreDetalle, 'Score');
    });
  }

  exportarRegistro(id: number) {
    // this.cargarOBuscarScoreDetalle(id);
    this.exportScoreDetalle(id)
  }

  listScoreDetalleImport: any[] = [];
  exportScoreDetalle(id_score: number){
    let parametro: any[] = [{
      "queryId": 17,
      "mapValue": {
          p_idScore : id_score,
      }
    }];
    this.scoreService.exportScoreDetalle(parametro[0]).subscribe((resp: any) => {
      this.listScoreDetalleImport = resp.list;

    this.exportExcellService.exportarExcel(this.listScoreDetalleImport, 'Score');
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

  listFormEnvio: any[] = [];
  getListFormatoEnvio(){
    let parametro: any[] = [{ queryId: 16 }];

    this.scoreService.getListFormatoEnvio(parametro[0]).subscribe((resp: any) => {
      this.listFormEnvio = resp.list;
    });
  };


  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarScoreM();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.scoreService.cargarOBuscarScoreM(offset.toString()).subscribe((resp: any) => {
          this.listScore = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  CrearScore_M() {
    const dialogRef = this.dialog.open(ModalStoreComponent, { width: '70%', height: '30%',});

    dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarScoreM();
        }
      });
  }

  actualizarScore(DATA: any) {
    console.log('DATA_SCORE_MAESTRA', DATA);

    const dialogRef = this.dialog.open(ModalStoreComponent, { width: '70%', height: '95%', data: DATA});
    dialogRef.afterClosed().subscribe((resp) => {
          this.cargarOBuscarScoreM();
      });
  }


}
