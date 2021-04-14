import { gql } from '@apollo/client';

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

export const CANCELAR_VENTA = gql`
  mutation Mutation(
    $_idCollection: String!
    $_idCliente: String!
    $cliente: String!
    $monto: Float!
  ) {
    cancelarVenta(
      _idCollection: $_idCollection
      _idCliente: $_idCliente
      cliente: $cliente
      monto: $monto
    ) {
      success
      message
      _id
    }
  }
`;

export const UPLOAD_ENVIO = gql`
  mutation Mutation($path: String!, $_idVenta: String!) {
    uploadEnvio(path: $path, _idVenta: $_idVenta) {
      success
      message
      _id
    }
  }
`;

export const EDITAR_VENTA = gql`
  mutation Mutation(
    $obj: JSON!
    $monto: Float!
    $_idCliente: String!
    $cliente: String!
    $_idVenta: String!
  ) {
    editarVenta(
      obj: $obj
      monto: $monto
      cliente: $cliente
      _idCliente: $_idCliente
      _idVenta: $_idVenta
    ) {
      success
      message
      _id
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
  mutation Mutation($objVenta: JSON!, $monto: Float!, $cliente: String!) {
    nuevaVenta(obj: $objVenta, monto: $monto, cliente: $cliente) {
      success
      message
      _id
    }
  }
`;

export const NUEVO_PAGO = gql`
  mutation Mutation($objPago: JSON!, $cliente: String!, $urls: [String]) {
    nuevoPago(obj: $objPago, cliente: $cliente, urls: $urls) {
      success
      message
      _id
    }
  }
`;
