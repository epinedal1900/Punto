import { gql } from '@apollo/client';

export const USUARIO = gql`
  query Usuario($uid: String!) {
    usuario(uid: $uid) {
      _id
      nombre
      roles
      infoPunto
      sinAlmacen
    }
  }
`;
export const PUNTO_ID_ACTIVO = gql`
  query PuntoIdActivo {
    puntoIdActivo
  }
`;
export const NOTIFICACIONES_PUNTO = gql`
  query NotificacionesPunto {
    notificacionesPunto
  }
`;

export const CLIENTES = gql`
  query Clientes {
    clientes {
      _id
      Nombre: nombre
      Telefono: telefono1
      Balance: balance
    }
  }
`;

export const CLIENTE = gql`
  query Cliente($_id: String!) {
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
  query NuevaVentaUtils($_idProductos: String!) {
    clientes {
      _id
      nombre
    }
    productos(_id: $_idProductos) {
      objects
    }
  }
`;
export const NUEVO_REGISTRO_INVENTARIO_UTILS = gql`
  query NuevoRegistroInventarioUtils($_idProductos: String!, $nombre: String!) {
    inventario(nombre: $nombre) {
      fecha
      inventario {
        articulo
        cantidad
      }
    }
    productos(_id: $_idProductos) {
      objects
    }
  }
`;

export const VENTAS = gql`
  query Ventas {
    ventas {
      _id
      Fecha: fecha
      Nombre: nombre
      Monto: monto
      Tipo: tipo
    }
  }
`;
export const INVENTARIO = gql`
  query Inventario($nombre: String!) {
    inventario(nombre: $nombre) {
      inventario {
        articulo
        cantidad
      }
    }
  }
`;
export const MOVIMIENTOS = gql`
  query Movimientos($_id: String!) {
    movimientos(_id: $_id) {
      fecha
      movimientos {
        _id
        Fecha: fecha
        Tipo: tipo
        Monto: monto
        Pago: pago
        Prendas: prendas
        articulos {
          articulo
          cantidad
          precio
        }
        comentarios
      }
      gastos {
        Fecha: fecha
        Descripcion: descripcion
        Monto: monto
      }
    }
  }
`;
export const DETALLES_MOVIMIENTOS_UTILS = gql`
  query DetallesMovimientosUtils($_id: String!, $_idProductos: String!) {
    movimientos(_id: $_id) {
      fecha
      movimientos {
        _id
        Fecha: fecha
        Tipo: tipo
        Monto: monto
        Pago: pago
        Prendas: prendas
        articulos {
          articulo
          cantidad
          precio
        }
        comentarios
      }
      gastos {
        Fecha: fecha
        Descripcion: descripcion
        Monto: monto
      }
    }
    productos(_id: $_idProductos) {
      objects
    }
  }
`;
export const NUEVO_PAGO_UTILS = gql`
  query NuevoPagoUtils($_idCuentas: String!) {
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
  query Otros($_idCuentas: String!, $_idProductos: String!) {
    cuentas(_id: $_idCuentas) {
      values
    }
    productos(_id: $_idProductos) {
      objects
    }
  }
`;

export const CUENTAS = gql`
  query Cuentas($_idCuentas: String!) {
    cuentas(_id: $_idCuentas) {
      values
    }
  }
`;

export const PRODUCTOS = gql`
  query Productos($_idProductos: String!) {
    productos(_id: $_idProductos) {
      objects
    }
  }
`;
