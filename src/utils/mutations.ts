import { gql } from '@apollo/client';

export const MARCAR_LEIDOS_PUNTO = gql`
  mutation MarcarLeidos($in: String!) {
    marcarLeidos(in: $in) {
      success
      message
      _id
    }
  }
`;

export const ENVIAR_REPORTE_URL = gql`
  mutation enviarReporteUrl($chat: Chat!, $url: String!) {
    enviarReporteUrl(chat: $chat, url: $url) {
      success
      message
      _id
    }
  }
`;
export const DESACTIVAR_PLAZA_CON_INVENTARIO = gql`
  mutation desactivarPlazaConInventario($in: String!) {
    desactivarPlazaConInventario(in: $in) {
      success
      message
      _id
    }
  }
`;

export const CANCELAR_VENTA_PUNTO = gql`
  mutation cancelarVentaPunto($_idVenta: String!, $puntoId: String!) {
    cancelarVentaPunto(_idVenta: $_idVenta, puntoId: $puntoId) {
      success
      message
      _id
    }
  }
`;
export const CANCELAR_VENTA = gql`
  mutation cancelarVenta($_idVenta: String!, $nombre: String!) {
    cancelarVenta(_idVenta: $_idVenta, nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const SUBIR_DATOS = gql`
  mutation subirDatos(
    $intercambio: [intercambioVariables!]!
    $venta_punto: [ventaPuntoVariables!]!
    $venta_cliente: [ventaClienteVariables!]!
    $pago: [pagoVariables!]!
    $gasto: [gastoVariables!]!
  ) {
    subirDatos(
      intercambio: $intercambio
      venta_punto: $venta_punto
      venta_cliente: $venta_cliente
      pago: $pago
      gasto: $gasto
    ) {
      erroresIds {
        gasto
        intercambio
        pago
        venta_cliente
        venta_punto
      }
      message
      success
      usuario {
        _id
        _idPunto
        _idPuntoPrincipal
        idInventario
        infoPunto
        sinAlmacen
      }
    }
  }
`;

export const CANCELAR_PAGO = gql`
  mutation cancelarPago($_idPago: String!, $nombre: String!) {
    cancelarPago(_idPago: $_idPago, nombre: $nombre) {
      success
      message
      _id
    }
  }
`;

export const CANCELAR_INTERCAMBIO = gql`
  mutation cancelarIntercambio($puntoId: String!, $_idIntercambio: String!) {
    cancelarIntercambio(puntoId: $puntoId, _idIntercambio: $_idIntercambio) {
      success
      message
      _id
    }
  }
`;

export const NUEVA_VENTA_CLIENTE = gql`
  mutation nuevaVentaCliente(
    $args: NuevaVentaArgs!
    $nombre: String!
    $puntoId: String!
    $_id: String!
  ) {
    nuevaVentaCliente(
      args: $args
      nombre: $nombre
      puntoId: $puntoId
      _id: $_id
    ) {
      success
      message
      _id
    }
  }
`;
export const NUEVA_VENTA_PUNTO_DE_VENTA = gql`
  mutation nuevaVentaPuntoDeVenta(
    $args: NuevaVentaPuntoArgs!
    $puntoId: String!
    $_id: String!
  ) {
    nuevaVentaPuntoDeVenta(args: $args, puntoId: $puntoId, _id: $_id) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_INTERCAMBIO = gql`
  mutation nuevoIntercambio(
    $prendas: [PrendasNuevoRegistro!]!
    $puntoIdReceptor: String!
    $puntoIdEmisor: String!
    $_id: String!
  ) {
    nuevoIntercambio(
      prendas: $prendas
      puntoIdReceptor: $puntoIdReceptor
      puntoIdEmisor: $puntoIdEmisor
      _id: $_id
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_GASTO = gql`
  mutation NuevoGasto($gasto: GastoInput!, $puntoId: String!, $_id: String!) {
    nuevoGasto(gasto: $gasto, puntoId: $puntoId, _id: $_id) {
      success
      message
      _id
    }
  }
`;
export const REPORTAR_ERROR = gql`
  mutation reportarError($operation: String) {
    reportarError(operation: $operation)
  }
`;
export const NUEVO_REGISTRO_DE_INVENTARIO = gql`
  mutation nuevoRegistroDeInventario(
    $articulos: [PrendasNuevoRegistro!]!
    $discrepancias: [PrendasNuevoRegistro!]!
    $_id: String!
    $nombre: String!
  ) {
    nuevoRegistroDeInventario(
      articulos: $articulos
      discrepancias: $discrepancias
      _id: $_id
      nombre: $nombre
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_PAGO = gql`
  mutation nuevoPago(
    $obj: ObjNuevoPago!
    $nombre: String!
    $puntoId: String!
    $_id: String!
  ) {
    nuevoPago(obj: $obj, nombre: $nombre, puntoId: $puntoId, _id: $_id) {
      success
      message
      _id
    }
  }
`;
