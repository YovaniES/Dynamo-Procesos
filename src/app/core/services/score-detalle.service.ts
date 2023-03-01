import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SCORE, API_IMPORT_SCORE_DETALLE } from '../constants/url.constants';
import { ScoreDetalle } from '../models/scored.models';

@Injectable({
  providedIn: 'root',
})
export class ScoreDetalleService {

  constructor(private http: HttpClient) {}

  insertarListadoDetalleScore(listDetalle: ScoreDetalle[]) {
    return this.http.post(API_IMPORT_SCORE_DETALLE + '/Guardar', listDetalle);
  }

  crearScoreDetalle(obj: any){
    return this.http.post(API_SCORE, obj);
  }
}
