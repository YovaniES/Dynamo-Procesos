import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { API_AUTH_SESSION_SCORE } from '../constants/url.constants';
import { of } from 'rxjs';
import { ROLES_ENUM, ROL_GESTOR, ROL_SOLICITANTE } from '../constants/rol.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toggleUserPanel = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  login_score(loginData: any) {
    return this.http.post<any>(API_AUTH_SESSION_SCORE, loginData).pipe(
      tap((resp: any) => {
        console.log('LOGIN_SCORE:', resp);
        console.log('LOGIN_SCORE_ACCESO: ', resp.user.acceso);
        console.log('LOGIN_SCORE_APLIC: ', resp.user.aplicacion);
        console.log('LOGIN_SCORE_ROLNAME: ', resp.user.rolName);

        localStorage.setItem('token', resp.user.token);
        localStorage.setItem('currentUser', JSON.stringify(resp));
      })
    );
  }

  accesoBtnMail(roles: ROLES_ENUM[]){
    const decodedToken_RolId: any = this.decodeToken()
    return roles.includes(decodedToken_RolId.ROL_ID)
  }

  getRolID(){
    const decodedToken: any = this.decodeToken();
    console.log('TOKEN', decodedToken);
    return decodedToken ? decodedToken.ROL_ID : '';
  }

  getUserNameByRol(){
    const usuarioLogeado: any = this.decodeToken();

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_SOLICITANTE.rolID ) {
      return null
    } else {
      return usuarioLogeado.name
    }
  }

  getRolId(){
    const usuarioLogeado: any = this.decodeToken();
    console.log('ROL_ID_TOKEN', usuarioLogeado);

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_SOLICITANTE.rolID ) {
      return null
    } else {
      return usuarioLogeado.ROL_ID
    }
  }

  // rolId:202
  esUsuarioGestor(): boolean{
    const usuarioLogeado:any = this.decodeToken();
    // console.log('ROL_ID_LOGUEADO', usuarioLogeado.ROL_ID);

    if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_GESTOR.rolID ) {
      return false
    } else {
      return true
    }
  }

    // rolId:202
    esUsuarioSolicitante(): boolean{
      const usuarioLogeado:any = this.decodeToken();
      // console.log('ROL_ID_LOGUEADO', usuarioLogeado.ROL_ID);

      if (!usuarioLogeado || usuarioLogeado.ROL_ID != ROL_SOLICITANTE.rolID ) {
        return false
      } else {
        return true
      }
    }

    //userName:jahgamarra
  // unique_name:"jysantiago"
  getCurrentUser() {
    const currentUser: any = localStorage.getItem('currentUser');
    console.log('USER_LOGUEADO',JSON.parse(currentUser));
    return of(currentUser ? JSON.parse(currentUser) : '');
  }

  getUsername() {
    const decodedToken: any = this.decodeToken();
    console.log('UNIQUE_NAME', decodedToken, decodedToken.name);
    console.log('USER_NAME', decodedToken.name);
    return decodedToken ? decodedToken.name : '';
  }

  decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return jwt_decode(token);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let validSession = false;
    let decodedToken: any = null;

    try {
      if (token) {
        decodedToken = jwt_decode(token);
      }

      if (decodedToken && decodedToken.exp) {
        validSession = true;
      }
      return validSession;
    } catch (err) {
      return false;
    }
  }

  logout() {
    this.router.navigateByUrl('auth');
    localStorage.clear();
  }
}
