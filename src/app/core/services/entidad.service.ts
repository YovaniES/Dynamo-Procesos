import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_EVENTO } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  constructor(private http: HttpClient) {}

  eliminarEntidad(id: number) {
    return this.http.post(API_EVENTO, id);
  }

  crearEntidadLista(obj: any) {
    return this.http.post(API_EVENTO, obj);
  }

  actualizarTablaEntidad(obj: any) {
    return this.http.post(API_EVENTO, obj);
  }

  agregarEntidadTabla(obj: any) {
    return this.http.post(API_EVENTO, obj);
  }

  getListEntidades(obj: any) {
    return this.http.post(API_EVENTO, obj);
  }

  cargarOBuscarEntidades(id: any) {
    return this.http.post(API_EVENTO, id);
  }

  getListEntidadesLider(id: any) {
    return this.http.post(API_EVENTO, id);
  }
}

