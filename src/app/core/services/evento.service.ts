import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_EVENTO } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class EventoService {

  constructor(private http: HttpClient) {}

  cargarOBuscarEvento(obj: any) {
    return this.http.post(API_EVENTO, obj);
  }

  eliminarEvento(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  bajaOaltaAlEvento(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getListAreaResponsable(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getListEstTicket(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getlistTipoIncidencia(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getlistAplicaciones(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getListPrioridades(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getListEstado(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getlistDescripcion(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getlistMotivosEvento(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  getListNotificaciones(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  ListaHistoricoCambios(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  crearEvento(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  actualizarEvento(obj: any){
    return this.http.post(API_EVENTO, obj);
  }

  listaDetalleByID(obj: any){
    return this.http.post(API_EVENTO, obj);
  }
}
