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
    this.cargarOBuscarEvento();
    this.getListAreaResponsable();
    this.getListEstadoTicket();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      cod_ticket           : [''],
      usuario              : [''],
      area_responsable     : [''],
      estado_ticket        : [''],
      fecha_registro_inicio: [''],
      fecha_registro_fin   : [''],
    })
  };

  listaEventos: any[] = [];
  cargarOBuscarEvento(){
    this.blockUI.start("Cargando Score...");
    let parametro: any[] = [{
      "queryId": 41,
      "mapValue": {
          p_cod_ticket         : this.filtroForm.value.cod_ticket,
          p_usuario            : this.filtroForm.value.usuario,
          p_estado_ticket      : this.filtroForm.value.estado_ticket,
          p_id_area_responsable: this.filtroForm.value.area_responsable,
          inicio               : this.datepipe.transform(this.filtroForm.value.fecha_registro_inicio,"yyyy/MM/dd"),
          fin                  : this.datepipe.transform(this.filtroForm.value.fecha_registro_fin,"yyyy/MM/dd"),
      }
    }];
    this.eventoService.cargarOBuscarEvento(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-score', resp, resp.list.length);
      this.listaEventos = [];
      this.listaEventos = resp.list;

      this.spinner.hide();
    });
  }

  eliminarEvento(id: number, cod_evento: string){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 46,
      mapValue: {
        p_idRegistro: id,
      }
    }];
    Swal.fire({
      title: '¿Eliminar Score?',
      text: `¿Estas seguro que deseas eliminar el Score: ${cod_evento}?`,
      icon: 'question',
      confirmButtonColor: '#ff6070',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.eventoService.eliminarEvento(parametro[0]).subscribe(resp => {

          this.cargarOBuscarEvento();

            Swal.fire({
              title: 'Eliminar Evento',
              text: `El Score: ${cod_evento}, fue eliminado con éxito`,
              icon: 'success',
            });
          });
      }
    });
    this.spinner.hide();
  }


  listEstadoTicket: any[] = [];
  getListEstadoTicket() {
    let parametro: any[] = [{ queryId: 45 }];

    this.eventoService.getListEstTicket(parametro[0]).subscribe((resp: any) => {
        this.listEstadoTicket = resp.list;
        console.log('EST_TICKET', resp);
      });
  }

  listAreaResponsable: any[] = [];
  getListAreaResponsable() {
    let parametro: any[] = [{ queryId: 34 }];

    this.eventoService.getListAreaResponsable(parametro[0]).subscribe((resp: any) => {
        this.listAreaResponsable = resp.list;
        // console.log('AREA_RESP', resp);
      });
  }

  limpiarFiltro() {
    this.filtroForm.reset('', { emitEvent: false });
    this.newFilfroForm();

    this.cargarOBuscarEvento();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.eventoService.cargarOBuscarEvento(offset.toString()).subscribe((resp: any) => {
          this.listaEventos = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  crearEvento() {
    const dialogRef = this.dialog.open(ModalScoreComponent, { width: '70%', height: '90%'});
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarEvento();
      }
    });
  }

  actualizarPersonal(DATA: any) {
    console.log('DATA_EVENTO', DATA);

    const dialogRef = this.dialog.open(ModalScoreComponent, { width: '70%', height: '95%', data: DATA});
    dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.cargarOBuscarEvento();
        }
      });
  }

  // abrirDetalleEvento(dataDetalle: string) {
  //   console.log('DATA_DETALLE', dataDetalle);

  //   const dialogRef = this.dialog.open(ModalDetalleComponent, { width: '60%',data: dataDetalle});
  //   dialogRef.afterClosed().subscribe((resp) => {
  //     if (resp) {
  //       this.cargarOBuscarEvento();
  //     }
  //   });
  // }

  exportarRegistro() {
    // this.exportExcellService.exportarExcel(this.listaEventos, 'Evento');
  }
}
