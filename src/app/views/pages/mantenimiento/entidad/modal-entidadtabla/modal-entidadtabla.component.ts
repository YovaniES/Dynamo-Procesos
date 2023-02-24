import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { EntidadService } from 'src/app/core/services/entidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-entidadtabla',
  templateUrl: './modal-entidadtabla.component.html',
  styleUrls: ['./modal-entidadtabla.component.scss']
})
export class ModalEntidadtablaComponent implements OnInit {

  userID: number = 0;
  entidadTablaForm!: FormGroup;

  constructor(
    private entidadService: EntidadService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalEntidadtablaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_SCORE: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.userId();
    this.cargarTablaEntidadByID();
    this.getListIdPadreTabla();
    // console.log('DATA_TABLA_E', this.DATA_SCORE, this.DATA_SCORE.eForm, this.DATA_SCORE.eForm.entidad);
    // console.log('ABC_DATA', this.DATA_SCORE.idTablaEntidad, this.DATA_SCORE.eForm.entidad);
  }

  newForm(){
    this.entidadTablaForm = this.fb.group({
      id_entidad        : [''],
      nombre            : ['', Validators.required],
      descripcion       : [''],
      entidad           : [''],
      idPadre           : [''],
      idCorrelativo     : [''],
      val_num           : [''],
      id_tabla          : [''],
      NombreTablaEntidad: [''],
      nombrePadre       : [''],
      idTablaEntidad    : [''],
    })
  }

  entidadTabla: any[]=[];
  getListIdPadreTabla(idTabla?:any){
    let arrayParametro:any[] = [{
      "queryId": 65,
      "mapValue": {
        "param_id_tabla": this.DATA_SCORE.idTablaEntidad
      }
    }];

    this.entidadService.cargarOBuscarEntidades(arrayParametro[0]).subscribe(data => {
      const arrayData:any[] = Array.of(data);
      console.log('ARRAY', arrayData);

      this.entidadTabla = [];
      for (let index = 0; index < arrayData[0].list.length; index++) {
        this.entidadTabla.push({
          id:arrayData[0].list[index].idPadre,
          nombre:arrayData[0].list[index].valor_texto_1
        });
      }
    });
  }

  agregarOactualizarTablaEntidad(){
    if (!this.DATA_SCORE) {
      return
    }

    if (this.DATA_SCORE.isCreation) {
      if (this.entidadTablaForm.valid) {this.agregarEntidadTabla()}
    } else {
      this.actualizarTablaEntidad();
    }
  }

  agregarEntidadTabla() {
    this.spinner.show();
    const formValues = this.entidadTablaForm.getRawValue();

    let parametro: any =  {
        queryId: 70,
        mapValue: {
          "param_nombre"        : formValues.nombre,
          "param_descripcion"   : formValues.descripcion,
          "param_id_padre"      : formValues.idPadre,
          "param_id_tabla"      : this.DATA_SCORE.eForm.entidad,
          "CONFIG_USER_ID"      : this.userID,
          "CONFIG_OUT_MSG_ERROR": '',
          "CONFIG_OUT_MSG_EXITO": ''
        },
      };

     console.log('TABLA-ENT-AGREGADO', this.entidadTablaForm.value , parametro);
    this.entidadService.agregarEntidadTabla(parametro).subscribe((resp: any) => {

      Swal.fire({
        title: 'Agregar Entidad!',
        text: `Entidad: ${formValues.nombre}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  actualizarTablaEntidad(){
    this.spinner.show();

    const formValues = this.entidadTablaForm.getRawValue();
    let parametro: any[] = [{
        queryId: 66,
        mapValue: {
          "p_id"                : formValues.id_entidad,
          "p_id_tabla"          : formValues.id_tabla,
          "p_id_correlativo"    : formValues.idCorrelativo,
          "p_valor_texto_1"     : formValues.nombre,
          "p_descripcion"       : formValues.descripcion,
          "p_val_num"           : formValues.val_num,
          "p_id_padre"          : formValues.idPadre,
          "CONFIG_USER_ID"      : this.userID,
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''
        },
      }];

    this.entidadService.actualizarTablaEntidad(parametro[0]).subscribe( {next: (resp) => {
      this.spinner.hide();

      this.cargarTablaEntidadByID();
      this.dialogRef.close('Actualizar')

      Swal.fire({
        title: 'Actualizar Entidad!',
        text : `Entidad:  ${formValues.nombre }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    }, error: () => {
      Swal.fire(
        'ERROR',
        'No se pudo actualizar la entidad',
        'warning'
      );
    }});
  };

  btnAction: string = 'Agregar'
  cargarTablaEntidadByID(){
    console.log('DTA_BY_MODAL', this.DATA_SCORE, this.DATA_SCORE.idTablaEntidad);

    if (!this.DATA_SCORE.isCreation) {
      this.btnAction = 'Actualizar'
        this.entidadTablaForm.controls['id_entidad'        ].setValue(this.DATA_SCORE.id_entidad);
        this.entidadTablaForm.controls['idCorrelativo'     ].setValue(this.DATA_SCORE.id_correlativo);
        this.entidadTablaForm.controls['nombre'            ].setValue(this.DATA_SCORE.valor_texto_1);
        this.entidadTablaForm.controls['descripcion'       ].setValue(this.DATA_SCORE.descripcion);
        this.entidadTablaForm.controls['entidad'           ].setValue(this.DATA_SCORE.entidad);
        // this.entidadTablaForm.controls['id_tabla'     ].setValue(this.DATA_SCORE.idTablaEntidad)
        this.entidadTablaForm.controls['id_tabla'          ].setValue(this.DATA_SCORE.id_tabla)
        this.entidadTablaForm.controls['idPadre'           ].setValue(this.DATA_SCORE.idPadre);
        this.entidadTablaForm.controls['idPadre'           ].setValue(this.DATA_SCORE.idPadre);
        this.entidadTablaForm.controls['NombreTablaEntidad'].setValue(this.DATA_SCORE.NombreTablaEntidad);
        this.entidadTablaForm.controls['nombrePadre'       ].setValue(this.DATA_SCORE.nombrePadre);
        this.entidadTablaForm.controls['idTablaEntidad'    ].setValue(this.DATA_SCORE.idTablaEntidad);
    }
  }

  campoNoValido(campo: string): boolean {
    if ( this.entidadTablaForm.get(campo)?.invalid && this.entidadTablaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  userId() {
    this.authService.getCurrentUser().subscribe((resp) => {
      this.userID = resp.user.userId;
      // console.log('ID-USER', this.userID);
    });
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

}
