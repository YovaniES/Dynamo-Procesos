import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SCORE } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  constructor(private http: HttpClient) {}

  eliminarEntidad(id: number) {
    return this.http.post(API_SCORE, id);
  }

  crearEntidadLista(obj: any) {
    return this.http.post(API_SCORE, obj);
  }

  actualizarTablaEntidad(obj: any) {
    return this.http.post(API_SCORE, obj);
  }

  agregarEntidadTabla(obj: any) {
    return this.http.post(API_SCORE, obj);
  }

  getListEntidades(obj: any) {
    return this.http.post(API_SCORE, obj);
  }

  cargarOBuscarEntidades(id: any) {
    return this.http.post(API_SCORE, id);
  }

  getListEntidadesLider(id: any) {
    return this.http.post(API_SCORE, id);
  }
}

