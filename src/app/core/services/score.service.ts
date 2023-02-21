import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SCORE } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {

  constructor(private http: HttpClient) {}

  cargarOBuscarScore(obj: any) {
    return this.http.post(API_SCORE, obj);
  }

  getListEstScore(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  ListaHistoricoCambios(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  cargarOBuscarScoreDetalle(obj: any){
    return this.http.post(API_SCORE, obj);
  }
  crearScore(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  actualizarScore(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  getListEstado(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  getListEstadoDetalle(obj: any){
    return this.http.post(API_SCORE, obj);
  }

  listaDetalleByID(obj: any){
    return this.http.post(API_SCORE, obj);
  }
}
