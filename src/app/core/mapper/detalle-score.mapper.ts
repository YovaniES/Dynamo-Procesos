import { ScoreDetalle } from '../models/scored.models';

export function mapearListadoDetalleScore(scoreData: any[], idScore: number): ScoreDetalle[] {
  const listadoDetaalle: ScoreDetalle[] = scoreData.map((detalle) => {
    const scoreDetalle: ScoreDetalle = {
      idscore           : idScore,
      tipo_documento    : detalle.tipo_documento,
      numero_documento  : detalle.numero_documento,
      segmento          : detalle.segmento,
      nombres           : detalle.nombres,
      q_lineas          : detalle.q_lineas,
      capacidad_fin     : detalle.capacidad_fin, // AGREGAR
      codigo_fin        : detalle.codigo_fin,
      fecha_proceso     : detalle.fecha_proceso,
      score             : detalle.score,
      cargo_fijo_max    : detalle.cargo_fijo_max,
      observacion       : detalle.observacion,
      id_estado         : detalle.id_estado,
      idrequerimiento   : detalle.idrequerimiento,
      solicitante       : detalle.solicitante,
      Actualiza         : detalle.Actualiza,
      FActualiza        : detalle.FActualiza,
      idCarga           :  detalle.idCarga,
      iVersion          : detalle.iVersion
    };

    return scoreDetalle;
  });

  return listadoDetaalle;
}
