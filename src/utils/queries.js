import { gql } from '@apollo/client';

export const USUARIO = gql`
  query Query($uid: String!) {
    usuario(uid: $uid) {
      _id
      nombre
      roles
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

export const NUEVA_VENTA_UTILS = gql`
  query Query($_idProductos: String!, $_idCuentas: String!) {
    clientes {
      _id
      nombre
    }
    productos(_id: $_idProductos) {
      objects
    }
    cuentas(_id: $_idCuentas) {
      values
    }
  }
`;

export const VENTAS = gql`
  query Query {
    ventas {
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
    cuentas(_id: $_idCuentas) {
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
  query Query($_idProductos: String!) {
    productos(_id: $_idProductos) {
      objects
    }
  }
`;

// export const VENTAS = gql`
//   query Query {
//     ventas {
//       _id
//       Fecha: fecha
//       Nombre: nombre
//       Monto: monto
//       Tipo: tipo
//     }
//   }
// `;

// export const VENTA = gql`
//   query Query($_id: String!, $_idProductos: String!) {
//     venta(_id: $_id) {
//       Fecha: fecha
//       cliente
//       Nombre: nombre
//       Tipo: tipo
//       Ajuste: ajuste
//       Direccion: direccion
//       articulos {
//         articulo
//         cantidad
//         precio
//       }
//       Monto: monto
//       Comentarios: comentarios
//       comprobante
//     }
//     productos(_id: $_idProductos) {
//       objects
//     }
//   }
// `;
