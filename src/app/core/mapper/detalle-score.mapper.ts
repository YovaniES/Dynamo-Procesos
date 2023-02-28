import { ScoreDetalle } from '../models/scored.models';

export function mapearListadoDetalleScore(scoreData: any[], idScore: number, version: number): ScoreDetalle[] {
  const listadoDetaalle: ScoreDetalle[] = scoreData.map((detalle) => {
    const scoreDetalle: ScoreDetalle = {
      // idscore           : idScore,
      // tipo_documento    : detalle.tipo_documento,
      // numero_documento  : detalle.numero_documento,
      // segmento          : detalle.segmento,
      // nombres           : detalle.nombres,
      // q_lineas          : detalle.q_lineas,
      // capacidad_fin     : detalle.capacidad_fin,
      // codigo_fin        : detalle.codigo_fin,
      // fecha_proceso     : detalle.fecha_proceso,
      // score             : detalle.score,
      // cargo_fijo_max    : detalle.cargo_fijo_max,
      // observacion       : detalle.observacion,
      // id_estado         : detalle.id_estado,
      // idrequerimiento   : detalle.idrequerimiento,
      // solicitante       : detalle.solicitante,
      // Actualiza         : detalle.Actualiza,
      // FActualiza        : detalle.FActualiza,
      // idCarga           : detalle.idCarga,
      // iVersion          : version + 1


      idscore           : idScore,
      tipo_documento    : detalle.TIPODOCUMENTO,
      numero_documento  : detalle.NUMDOCUMENTO,
      segmento          : detalle.Segmento,
      nombres           : detalle.nombres,
      q_lineas          : detalle.QLINEAS,
      capacidad_fin     : detalle.CAPACIDADFINANCIAMIENTO,
      codigo_fin        : detalle.CODFINANCIAMIENTO,
      fecha_proceso     : detalle.FECHAPROCESO,
      score             : detalle.SCORE,
      cargo_fijo_max    : detalle.CARGOFIJOMAXIMO,
      observacion       : detalle.OBSERVACIONES,
      id_estado         : detalle.id_estado,
      idrequerimiento   : detalle.idrequerimiento,
      solicitante       : detalle.solicitante,
      Actualiza         : detalle.Actualiza,
      FActualiza        : detalle.FActualiza,
      idCarga           : detalle.idCarga,
      iVersion          : version + 1
    };

    return scoreDetalle;
  });

  return listadoDetaalle;
}
