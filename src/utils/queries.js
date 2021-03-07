import { gql } from '@apollo/client';

export const INITIAL_LOAD_PEDIDOS = gql`
  query Query {
    pedidos{
      _id
      Registro: fecha
      Nombre: nombre
      Prendas: prendas
      Entrega: entrega
    }
  }
`;

export const INITIAL_LOAD_VENTAS = gql`
  query Query {
    # clientes {
    # _id
    # Nombre: nombre
    # Telefono: telefono1
    # Balance: balance
    # }
    pagos{
      _id
      Fecha: fecha
      Nombre: nombre
      Monto: monto
      Tipo: tipo
    }
    ventas{
      _id
      Fecha: fecha
      Nombre: nombre
      Monto: monto
      Tipo: tipo
    }
    # pedidos{
    #   _id
    #   Registro: fecha
    #   Nombre: nombre
    #   Prendas: prendas
    #   Entrega: entrega
    # }
  }
`;

export const PRINCIPAL = gql`
  query Query {
    pagos{
      _id
      Fecha: fecha
      Nombre: nombre
      Monto: monto
      Tipo: tipo
    }
    ventas{
      _id
      Fecha: fecha
      Nombre: nombre
      Monto: monto
      Tipo: tipo
    }
  }
`;

export const USUARIO = gql`
  query Query($uid: String!) {
    usuario(uid: $uid) {
      _id
      nombre
      role
      readOnly
    }
  }
`;

export const CLIENTES = gql`
query Query {
  clientes {
    _id
    Nombre: nombre
    Telefono: telefono1
    Balance: balance
  }
}
`;

export const CLIENTE = gql`
query Query($_id: String!) {
  cliente(_id: $_id) {
    Nombre: nombre
    Telefono1: telefono1
    Telefono2: telefono2
    Correo: correo
    direcciones {
      Direccion: direccion
      CP: cp
      Estado: estado
    }
  }
}
`;

export const DIRECCIONES_CLIENTES = gql`
query Query($_id: String!) {
  cliente(_id: $_id) {
    direcciones {
      direccion
      cp
      estado
    }
  }
}
`;

export const ESTADO_DE_CUENTA = gql`
query Query($_id: String!) {
  estadoDeCuenta(_id: $_id) {
    balance
    estado {
      _id
      Fecha: fecha
      Descripcion: descripcion
      Monto: monto
      Balance: balance
    }
  }
  cliente(_id: $_id) {
    nombre
  }
}
`;


export const NUEVA_VENTA_UTILS = gql`
query Query($_idProductos: String!, $_idCuentas: String!) {
  clientes {
    _id
    nombre
  }
  productos(_id: $_idProductos){
    objects
  }
  cuentas(_id: $_idCuentas){
    values
  }
}
`;

export const PAGOS = gql`
query Query {
  pagos{
    _id
    Fecha: fecha
    Nombre: nombre
    Monto: monto
    Tipo: tipo
  }
}
`;

export const NUEVO_PAGO_UTILS = gql`
query Query($_idCuentas: String!) {
  clientes {
    _id
    nombre
  }
  cuentas(_id: $_idCuentas){
    values
  }
}
`;

export const OTROS = gql`
query Query($_idCuentas: String!, $_idProductos: String!) {
  cuentas(_id: $_idCuentas) {
    values
  }
  productos(_id: $_idProductos) {
    objects
  }
}
`;

export const CUENTAS = gql`
query Query($_idCuentas: String!) {
  cuentas(_id: $_idCuentas) {
    values
  }
}
`;

export const PRODUCTOS = gql`
query Query( $_idProductos: String!) {
  productos(_id: $_idProductos) {
    objects
  }
}
`;

export const PAGO = gql`
query Query($_id: String!) {
  pago(_id: $_id) {
    Fecha: fecha
    cliente
    Nombre: nombre
    Tipo: tipo
    Cuenta: cuenta
    Monto: monto
    Comentarios: comentarios
    comprobantes
  }
}
`;

export const PEDIDOS_READ_ONLY = gql`
query Query {
  pedidos{
    _id
    Registro: fecha
    Nombre: nombre
    Prendas: prendas
    Entrega: entrega
  }
}
`;

export const PEDIDOS = gql`
query Query($_idProductos: String!) {
  pedidos{
    _id
    Registro: fecha
    Nombre: nombre
    Prendas: prendas
    Entrega: entrega
  }
  clientes {
    _id
    nombre
  }
  productos(_id: $_idProductos){
    objects
  }
}
`;

export const PEDIDO = gql`
query Query($_id: String!, $_idProductos: String!) {
  pedido(_id: $_id) {
    Registro: fecha
    cliente
    Nombre: nombre
    Comentarios: comentarios
    Entrega: entrega
    articulos{
      articulo
      cantidad
      precio
    }
    archivos
    ventas
  }
  productos(_id: $_idProductos){
    objects
  }
}
`;

export const VENTAS = gql`
query Query {
  ventas{
    _id
    Fecha: fecha
    Nombre: nombre
    Monto: monto
    Tipo: tipo
  }
}
`;

export const VENTA = gql`
query Query($_id: String!, $_idProductos: String!) {
  venta(_id: $_id) {
    Fecha: fecha
    cliente
    Nombre: nombre
    Tipo: tipo
    Ajuste: ajuste
    Direccion: direccion
    articulos{
      articulo
      cantidad
      precio
    }
    Monto: monto
    Comentarios: comentarios
    comprobante
  }
  productos(_id: $_idProductos){
    objects
  }
}
`;
export const DETALLES_VENTA = gql`
  query Query($_id: String!) {
    venta(_id: $_id) {
      articulos {
        articulo
        cantidad
        precio
      }
    }
  } 
`;

export const ESTADO_CLIENTE = gql`
query Query($_id: String!) {
  cliente(_id: $_id) {
    Nombre: nombre
    Telefono: telefono
    Correo: correo
    direcciones {
      Direccion: direccion
      CP: cp
      Estado: estado
    }
  }
}
`;