import { gql } from '@apollo/client';

export const MARCAR_LEIDOS_PUNTO = gql`
  mutation Mutation($nombre: String!) {
    marcarLeidos(nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const ENVIAR_REPORTE_URL = gql`
  mutation Mutation($url: String!, $nombre: String!) {
    enviarReporteUrl(url: $url, nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const MODIFICAR_PUNTOS_ACTIVOS = gql`
  mutation Mutation($nombre: String!, $propiedad: String!) {
    modificarPuntosActivos(nombre: $nombre, propiedad: $propiedad) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_CLIENTE = gql`
  mutation Mutation($obj: JSON!) {
    nuevoCliente(obj: $obj) {
      success
      message
      _id
    }
  }
`;

export const ADD_DIRECCION = gql`
  mutation Mutation($obj: JSON!, $_idCliente: String!) {
    addDireccion(obj: $obj, _idCliente: $_idCliente) {
      success
      message
      _id
    }
  }
`;

export const CANCELAR_MOVIMIENTO = gql`
  mutation Mutation(
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

export const MOVIMIENTO = gql`
  query Query($_id: String!, $_idProductos: String!) {
    movimiento(_id: $_id) {
      Fecha: fecha
      Nombre: nombre
      Tipo: tipo
      articulos {
        articulo
        cantidad
        precio
      }
      Monto: monto
      Comentarios: comentarios
    }
    productos(_id: $_idProductos) {
      objects
    }
  }
`;

export const CANCELAR_PAGO = gql`
  mutation Mutation(
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
  mutation Mutation(
    $obj: JSON!
    $cliente: String!
    $prendas: Int!
    $urls: [String]
  ) {
    nuevoPedido(obj: $obj, cliente: $cliente, prendas: $prendas, urls: $urls) {
      success
      message
      _id
    }
  }
`;

export const NUEVA_VENTA = gql`
  mutation Mutation(
    $objVenta: JSON!
    $monto: Float
    $cliente: String
    $puntoId: String
    $nombre: String
    $idPago: String
  ) {
    nuevaVenta(
      obj: $objVenta
      monto: $monto
      cliente: $cliente
      puntoId: $puntoId
      nombre: $nombre
      idPago: $idPago
    ) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_INTERCAMBIO = gql`
  mutation Mutation(
    $obj: JSON!
    $nombreSalida: String!
    $nombreEntrada: String!
  ) {
    nuevoIntercambio(
      obj: $obj
      nombreSalida: $nombreSalida
      nombreEntrada: $nombreEntrada
    ) {
      success
      message
      _id
    }
  }
`;
export const NUEVO_GASTO = gql`
  mutation Mutation($obj: JSON!, $puntoId: String!) {
    nuevoGasto(obj: $obj, puntoId: $puntoId) {
      success
      message
      _id
    }
  }
`;
export const NUEVO_REGRESO = gql`
  mutation Mutation($obj: JSON!, $puntoId: String!, $nombre: String!) {
    nuevoRegreso(obj: $obj, puntoId: $puntoId, nombre: $nombre) {
      success
      message
      _id
    }
  }
`;
export const REGISTRAR_DISCREPANCIAS = gql`
  mutation Mutation(
    $articulos: [JSON]!
    $puntoId: String!
    $tipo: String!
    $nombre: String
    $sobrescribir: [JSON]
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
  mutation Mutation(
    $objPago: JSON!
    $cliente: String!
    $urls: [String]
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
