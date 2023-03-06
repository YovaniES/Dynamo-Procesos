const ENVIROMENT: string = 'PROD';

let PATH_API_SCORE  = '';
let API_SAVE_DATA_IMPORT = '';
let PATH_SCORE_AUTH = '';
switch (ENVIROMENT) {
  case 'DEV':
    // PATH_SCORE_AUTH =  'http://localhost:3080/aut/seguridad';
    break;
  case 'QA':
    PATH_SCORE_AUTH = '';
    break;
  case 'PROD':
    // PATH_API_SCORE       = 'https://localhost:3061/api/configurador/';
    // API_SAVE_DATA_IMPORT       = 'https://localhost:7247/api/ScoreDetalle';

    API_SAVE_DATA_IMPORT = 'http://saveimporteddata.indratools.com/api/ScoreDetalle'
    PATH_API_SCORE       = 'http://backwebprocesos.indratools.com/api/configurador/';

    PATH_SCORE_AUTH     = 'http://seguridadweb.indratools.com/aut/seguridad/'
    break;
  default:
    break;
}

// LOGIN
export const API_AUTH_SESSION_SCORE = PATH_SCORE_AUTH + 'login';

// REGISTRO EVENTO
export const API_SCORE = PATH_API_SCORE + 'ExecuteQuery';

// API guardar data importada
export const API_IMPORT_SCORE_DETALLE = API_SAVE_DATA_IMPORT;
