import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { EntidadService } from 'src/app/core/services/entidad.service';
import Swal from 'sweetalert2';
import { ModalEntidadlistaComponent } from './modal-entidadlista/modal-entidadlista.component';
import { ModalEntidadtablaComponent } from './modal-entidadtabla/modal-entidadtabla.component';

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: ['./entidad.component.scss']
})
export class EntidadComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userID: number = 0;

  filtroForm!: FormGroup;

  page = 1;
  totalEntidad: number = 0;
  pageSize = 5;

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getListEntidades();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      entidad  : [''],
    })
  };

  totaltablas = {
    id: "",
  };

  idPadre     : any
  nombre      : any
  tablaEntidad: any
  getInfoTotalTablaEntidad(id: any, evento: any) {
    this.totaltablas.id = id;
    this.idPadre = evento.target["options"][evento.target["options"].selectedIndex].id;
    this.nombre  = evento.target["options"][evento.target["options"].selectedIndex].innerText;
    this.tablaEntidad = [];

    // console.log('NNOMBRE_ENT', this.nombre);
    this.cargarOBuscarEntidades(id);
  }


  listEntidadTabla: any[] = [];
  cargarOBuscarEntidades(idTabla: number){
    this.blockUI.start("Cargando lista de entidades...");

    let parametro: any[] = [{
      "queryId": 62,
      "mapValue": { param_id_tabla: idTabla }
    }];
    this.entidadService.cargarOBuscarEntidades(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('ID_TABLA_ENTIDAD', resp.list, [resp.list.length]);
      this.listEntidadTabla = [];
      this.listEntidadTabla = resp.list;
    });
  }

  abrirEliminarEntidad(idTabla: number, idCorrelativo: number, nameEntidad: string){
    Swal.fire({
      title: `Eliminar Entidad?`,
      text: `¿Desea eliminar la Entidad: ${nameEntidad}?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
        if (resp.value) {
          this.eliminarEntidad(idTabla, idCorrelativo, nameEntidad);
       }
      });
  }

  eliminarEntidad(idTabla: number, idCorrelativo: number, nameEntidad: string){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 64,
      mapValue: {
        "param_id_tabla"      : idTabla,
        "param_id_correlativo": idCorrelativo,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR":'',
        "CONFIG_OUT_MSG_EXITO":''
      }
    }];
    this.entidadService.eliminarEntidad(parametro[0]).subscribe((resp: any) => {

      if (resp && !resp.errorMessage) {
        Swal.fire({
          title: 'Eliminar Entidad',
          text: `La Entidad: ${nameEntidad}, fue eliminado con éxito`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: `Eliminar Entidad`,
          text: `La Entidad: ${nameEntidad}, no pudo ser eliminado por que se encuentra Asignado`,
          icon: 'error',
        });
      }
      this.cargarOBuscarEntidades(idTabla);
    });
    this.spinner.hide();
  }

  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalEntidad) {
      this.entidadService.cargarOBuscarEntidades(offset.toString()).subscribe((resp: any) => {
          this.listEntidadTabla = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  nombreEntidad!: string;
  listEntidad: any[] = [];
  getListEntidades(){
    let parametro: any[] = [{queryId: 48}];

    this.entidadService.getListEntidades(parametro[0]).subscribe((resp: any) => {
      this.listEntidad = resp.list;

      console.log('List-Ent', this.listEntidad, this.listEntidad.length);

      this.nombreEntidad = resp.list.map((n:any) => n.id);
      // console.log('NAME_ENT',this.nombreEntidad);

    });
  }

  crearEntidadLista(){
    this.dialog.open(ModalEntidadlistaComponent, {width:'30%'})
               .afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarOBuscarEntidades()
        this.getListEntidades()
      }
    })
  }

  agregarEntidadTabla(){
    this.dialog.open(ModalEntidadtablaComponent, {width:'30%', data: {eForm: this.filtroForm.value, isCreation: true}})
               .afterClosed().subscribe(resp => {
            if (resp) {
              this.cargarOBuscarEntidades(this.filtroForm.controls['entidad'].value)
              // this.getListEntidades()
            }
        })
   }

   actualizarEntidadTabla(DATA: any) {
    console.log('DATA_SCORE',DATA);
    this.dialog
      .open(ModalEntidadtablaComponent, { width: '30%', data: DATA})
      .afterClosed().subscribe((resp) => {
        if (resp == 'Actualizar') {
          this.cargarOBuscarEntidades(DATA.id_tabla);
        }
      });
  }
}

