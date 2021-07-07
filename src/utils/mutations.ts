import { gql } from '@apollo/client';

export const MARCAR_LEIDOS_PUNTO = gql`
  mutation MarcarLeidos($nombre: String!) {
    marcarLeidos(nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const ENVIAR_REPORTE_URL = gql`
  mutation EnviarReporteUrl($url: String!, $nombre: String!) {
    enviarReporteUrl(url: $url, nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const MODIFICAR_PUNTOS_ACTIVOS = gql`
  mutation ModificarPuntosActivos($nombre: String!, $propiedad: String!) {
    modificarPuntosActivos(nombre: $nombre, propiedad: $propiedad) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_CLIENTE = gql`
  mutation NuevoCliente($obj: JSON!) {
    nuevoCliente(obj: $obj) {
      success
      message
      _id
    }
  }
`;

export const CANCELAR_MOVIMIENTO = gql`
  mutation CancelarMovimiento(
    $nombre: String!
    $puntoId: String!
    $idMovimiento: String!
    $movimiento: String!
    $articulos: JSON!
    $message: String!
    $conCliente: Boolean
  ) {
    cancelarMovimiento(
      nombre: $nombre
      puntoId: $puntoId
      idMovimiento: $idMovimiento
      movimiento: $movimiento
      articulos: $articulos
      message: $message
      conCliente: $conCliente
    ) {
      success
      message
      _id
    }
  }
`;

export const CANCELAR_PAGO = gql`
  mutation CancelarPago(
    $_idCollection: String!
    $_idCliente: String!
    $cliente: String!
    $monto: Float!
    $esDescuento: Boolean
  ) {
    cancelarPago(
      _idCollection: $_idCollection
      _idCliente: $_idCliente
      cliente: $cliente
      monto: $monto
      esDescuento: $esDescuento
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_PEDIDO = gql`
  mutation NuevoPedido(
    $obj: JSON!
    $cliente: String!
    $prendas: Int!
    $urls: [String!]
  ) {
    nuevoPedido(obj: $obj, cliente: $cliente, prendas: $prendas, urls: $urls) {
      success
      message
      _id
    }
  }
`;

export const NUEVA_VENTA = gql`
  mutation NuevaVenta(
    $objVenta: JSON!
    $monto: Float
    $cliente: String
    $puntoId: String
    $nombre: String
    $idPago: String
    $enviarMensaje: Boolean
  ) {
    nuevaVenta(
      obj: $objVenta
      monto: $monto
      cliente: $cliente
      puntoId: $puntoId
      nombre: $nombre
      idPago: $idPago
      enviarMensaje: $enviarMensaje
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_INTERCAMBIO = gql`
  mutation NuevoIntercambio(
    $obj: JSON!
    $nombreSalida: String!
    $nombreEntrada: String!
    $enviarMensaje: Boolean
  ) {
    nuevoIntercambio(
      obj: $obj
      nombreSalida: $nombreSalida
      nombreEntrada: $nombreEntrada
      enviarMensaje: $enviarMensaje
    ) {
      success
      message
      _id
    }
  }
`;
export const NUEVO_GASTO = gql`
  mutation NuevoGasto($obj: JSON!, $puntoId: String!, $enviarMensaje: Boolean) {
    nuevoGasto(obj: $obj, puntoId: $puntoId, enviarMensaje: $enviarMensaje) {
      success
      message
      _id
    }
  }
`;
export const NUEVO_REGRESO = gql`
  mutation NuevoRegreso($obj: JSON!, $puntoId: String!, $nombre: String!) {
    nuevoRegreso(obj: $obj, puntoId: $puntoId, nombre: $nombre) {
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
export const REGISTRAR_DISCREPANCIAS = gql`
  mutation RegistrarDiscrepancias(
    $articulos: [JSON!]!
    $puntoId: String!
    $tipo: String!
    $nombre: String
    $sobrescribir: [JSON!]
    $entradaId: String
  ) {
    registrarDiscrepancias(
      articulos: $articulos
      puntoId: $puntoId
      tipo: $tipo
      sobrescribir: $sobrescribir
      entradaId: $entradaId
      nombre: $nombre
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_PAGO = gql`
  mutation NuevoPago(
    $objPago: JSON!
    $cliente: String!
    $urls: [String!]
    $puntoId: String
  ) {
    nuevoPago(
      obj: $objPago
      cliente: $cliente
      urls: $urls
      puntoId: $puntoId
    ) {
      success
      message
      _id
    }
  }
`;
