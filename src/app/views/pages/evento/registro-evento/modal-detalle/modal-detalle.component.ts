import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventoService } from 'src/app/core/services/evento.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.scss']
})
export class ModalDetalleComponent implements OnInit {
  loadingItem: boolean = false;

  constructor(
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public DATA_EVENTO: any
  ) {
  }

  ngOnInit(): void {
    this.listaDetalleByID();
    console.log('DATA_EVENTO', this.DATA_EVENTO);

  }

  idEvento: string = '';
  listDetalle: any[] = [];
  listaDetalleByID(){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 43,
      "MapValue": {
        "p_id": this.DATA_EVENTO
      }
    }];
    this.eventoService.listaDetalleByID(parametro[0]).subscribe((resp: any) => {
      this.listDetalle = resp.list;
      this.idEvento = resp.list[0].cod_evento;

     console.log("Detalle_EVENTO", resp.list);
     console.log("Detalle_title", this.idEvento);
      this.spinner.hide();
    });
  }
}
