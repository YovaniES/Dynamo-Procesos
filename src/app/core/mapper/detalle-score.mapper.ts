import { ScoreDetalle } from '../models/scored.models';

export function mapearListadoDetalleScore(scoreData: any[], idScore: number, version: number): ScoreDetalle[] {
  const listadoDetaalle: ScoreDetalle[] = scoreData.map((detalle) => {
    const scoreDetalle: ScoreDetalle = {
      idscore           : idScore,
      tipo_documento    : detalle.TIPODOCUMENTO,
      numero_documento  : detalle.NUMDOCUMENTO,
      segmento          : detalle.Segmento,
      // nombres           : '',
      q_lineas          : detalle.QLINEAS,
      capacidad_fin     : detalle.CAPACIDADFINANCIAMIENTO, //Falta insertar: CAPACIDADFINANCIAMIENTO
      codigo_fin        : detalle.CODFINANCIAMIENTO,
      fecha_proceso     : new Date(detalle.FECHAPROCESO),
      score             : detalle.SCORE,
      cargo_fijo_max    : detalle.CARGOFIJOMAXIMO,
      observacion       : detalle.OBSERVACIONES,
      id_estado         : 1,  // default = 1: REGISTRADO
      idrequerimiento   : detalle.REQ, //Falta REQ
      solicitante       : detalle.Analista,
      // Actualiza         : '',
      // FActualiza        : '',
      idCarga           : detalle.idCarga,
      iVersion          : version + 1
    };

    return scoreDetalle;
  });

  return listadoDetaalle;
}
