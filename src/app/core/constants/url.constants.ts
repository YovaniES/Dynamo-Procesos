const ENVIROMENT: string = 'PROD';

let PATH_BACK_NET  = '';
let PATH_SCORE_AUTH = '';
switch (ENVIROMENT) {
  case 'DEV':
    // PATH_SCORE_AUTH = 'http://auditoriaseguridadapi2.indratools.com/aut/seguridad/';
    // PATH_BACK_NET       = 'https://localhost:3061/api/configurador/';
    break;
  case 'QA':
    PATH_SCORE_AUTH = '';
    break;
  case 'PROD':
    PATH_BACK_NET       = 'https://localhost:3061/api/configurador/';
    // PATH_BACK_NET       = 'http://backsistemanoc.indratools.com/api/configurador/';

    // PATH_BACK_NET       = 'http://auditoriabackapi.indratools.com/api/configurador/';


    // PATH_SCORE_AUTH = 'http://sistemanocseguridadapi.indratools.com/aut/seguridad/';
    // PATH_SCORE_AUTH =  'http://localhost:3080/aut/seguridad';

    // PATH_SCORE_AUTH = 'http://auditoriaseguridadapi2.indratools.com/aut/seguridad/';
    PATH_SCORE_AUTH = 'http://seguridadweb.indratools.com/aut/seguridad/'

    break;
  default:
    break;
}

// LOGIN
export const API_AUTH_SESSION_SCORE = PATH_SCORE_AUTH + 'login';

// REGISTRO EVENTO
export const API_SCORE = PATH_BACK_NET + 'ExecuteQuery';



