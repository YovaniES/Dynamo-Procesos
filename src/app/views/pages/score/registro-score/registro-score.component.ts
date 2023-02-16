import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ScoreService } from 'src/app/core/services/score.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
// import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalStoreComponent } from './modal-score/modal-score.component';

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
    private ScoreService: ScoreService,
    // private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarScore();
    this.getListEstScore();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      creado_por          : [''],
      solicitante         : [''],
      id_estado           : [''],
      fecha_solicitud_ini : [''],
      fecha_solicitud_fin : [''],
    })
  };

  listScore: any[] = [];
  cargarOBuscarScore(){
    this.blockUI.start("Cargando Score...");
    let parametro: any[] = [{
      "queryId": 57,
      "mapValue": {
          p_creado_por  : this.filtroForm.value.num_doc,
          p_id_estado   : this.filtroForm.value.id_estado,
          p_solicitante : this.filtroForm.value.solicitante,
          inicio        : this.datepipe.transform(this.filtroForm.value.fecha_solicitud_ini,"yyyy/MM/dd"),
          fin           : this.datepipe.transform(this.filtroForm.value.fecha_solicitud_fin,"yyyy/MM/dd"),
      }
    }];
    this.ScoreService.cargarOBuscarScore(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-score', resp, resp.list.length);
      this.listScore = [];
      this.listScore = resp.list;

      this.spinner.hide();
    });
  }

  listEstadoTicket: any[] = [];
  getListEstScore() {
    let parametro: any[] = [{ queryId: 45 }];

    this.ScoreService.getListEstScore(parametro[0]).subscribe((resp: any) => {
        this.listEstadoTicket = resp.list;
        console.log('EST_SCORE', resp);
      });
  }

  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarScore();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.ScoreService.cargarOBuscarScore(offset.toString()).subscribe((resp: any) => {
          this.listScore = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  // crearEvento() {
  //   const dialogRef = this.dialog.open(ModalStoreComponent, { width: '70%', height: '90%'});
  //   dialogRef.afterClosed().subscribe((resp) => {
  //     if (resp) {
  //       this.cargarOBuscarScore();
  //     }
  //   });
  // }

  actualizarScore(DATA: any) {
    console.log('DATA_SCORE_MAESTRA', DATA);

    const dialogRef = this.dialog.open(ModalStoreComponent, { width: '70%', height: '95%', data: DATA});
    dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarScore();
        }
      });
  }

  // abrirDetalleEvento(dataDetalle: string) {
  //   console.log('DATA_DETALLE', dataDetalle);

  //   const dialogRef = this.dialog.open(ModalDetalleComponent, { width: '60%',data: dataDetalle});
  //   dialogRef.afterClosed().subscribe((resp) => {
  //     if (resp) {
  //       this.cargarOBuscarScore();
  //     }
  //   });
  // }

  exportarRegistro() {
    // this.exportExcellService.exportarExcel(this.listScore, 'Evento');
  }
}
