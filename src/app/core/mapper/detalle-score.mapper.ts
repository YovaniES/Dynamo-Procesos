import { ScoreDetalle } from '../models/scored.models';

export function mapearListadoDetalleScore(scoreData: any[], idScore: number, version: number): ScoreDetalle[] {
  const listadoDetaalle: ScoreDetalle[] = scoreData.map((detalle) => {
    const scoreDetalle: ScoreDetalle = {
      idscore           : idScore,
      tipo_documento    : detalle.TIPODOCUMENTO,
      numero_documento  : detalle.NUMDOCUMENTO,
      segmento          : detalle.Segmento,
      q_lineas          : detalle.QLINEAS,
      capacidad_fin     : detalle.CAPACIDADFINANCIAMIENTO,
      codigo_fin        : detalle.CODFINANCIAMIENTO,
      fecha_proceso     : new Date(detalle.FECHAPROCESO),
      score             : detalle.SCORE,
      cargo_fijo_max    : detalle.CARGOFIJOMAXIMO,
      observacion_solic : detalle.OBSERVACIONES,
      observacion_gestor: '',
      id_estado         : 1,  // default = 1: Solicitado
      idrequerimiento   : detalle.REQ,
      solicitante       : detalle.Analista,
      financiamiento    : detalle.Financiamiento,
      nombre_req        : detalle.NombreREQ,
      // idcarga           : detalle.idCarga,
      item_version     : version + 1,
      negocio_segmento : detalle.NEGOCIOYSEGMENTO ,
      tipo_transaccion : detalle.TIPOTRANSACCION ,
      tipo_venta       : detalle.TIPODEVENTA ,
      gama             : detalle.GAMADEEQUIPO,
    };

    return scoreDetalle;
  });

  return listadoDetaalle;
}
