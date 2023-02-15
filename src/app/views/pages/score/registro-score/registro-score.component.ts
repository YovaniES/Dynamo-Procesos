import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EventoService } from 'src/app/core/services/evento.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
// import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalScoreComponent } from './modal-score/modal-score.component';

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
    private eventoService: EventoService,
    // private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarScore();
    this.getListEstadoTicket();
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

  listaEventos: any[] = [];
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
    this.eventoService.cargarOBuscarScore(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-score', resp, resp.list.length);
      this.listaEventos = [];
      this.listaEventos = resp.list;

      this.spinner.hide();
    });
  }

  // eliminarEvento(id: number, cod_evento: string){
  //   this.spinner.show();

  //   let parametro:any[] = [{
  //     queryId: 46,
  //     mapValue: {
  //       p_idRegistro: id,
  //     }
  //   }];
  //   Swal.fire({
  //     title: '¿Eliminar Score?',
  //     text: `¿Estas seguro que deseas eliminar el Score: ${cod_evento}?`,
  //     icon: 'question',
  //     confirmButtonColor: '#ff6070',
  //     cancelButtonColor: '#0d6efd',
  //     confirmButtonText: 'Si, Eliminar!',
  //     showCancelButton: true,
  //     cancelButtonText: 'Cancelar',
  //   }).then((resp) => {
  //     if (resp.value) {
  //       this.eventoService.eliminarEvento(parametro[0]).subscribe(resp => {

  //         this.cargarOBuscarScore();

  //           Swal.fire({
  //             title: 'Eliminar Evento',
  //             text: `El Score: ${cod_evento}, fue eliminado con éxito`,
  //             icon: 'success',
  //           });
  //         });
  //     }
  //   });
  //   this.spinner.hide();
  // }


  listEstadoTicket: any[] = [];
  getListEstadoTicket() {
    let parametro: any[] = [{ queryId: 45 }];

    this.eventoService.getListEstTicket(parametro[0]).subscribe((resp: any) => {
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
      this.eventoService.cargarOBuscarScore(offset.toString()).subscribe((resp: any) => {
          this.listaEventos = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  // crearEvento() {
  //   const dialogRef = this.dialog.open(ModalScoreComponent, { width: '70%', height: '90%'});
  //   dialogRef.afterClosed().subscribe((resp) => {
  //     if (resp) {
  //       this.cargarOBuscarScore();
  //     }
  //   });
  // }

  actualizarPersonal(DATA: any) {
    console.log('DATA_EVENTO', DATA);

    const dialogRef = this.dialog.open(ModalScoreComponent, { width: '70%', height: '95%', data: DATA});
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
    // this.exportExcellService.exportarExcel(this.listaEventos, 'Evento');
  }
}
