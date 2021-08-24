import { gql } from '@apollo/client';

export const CALENDARIO_REGISTROS_INVENTARIO = gql`
  query calendarioRegistrosInventario($_id: String!) {
    calendarioRegistrosInventario(_id: $_id) {
      dias {
        prendas {
          id
          reg
        }
        fecha
      }
    }
  }
`;

export const USUARIO = gql`
  query Usuario($uid: String!) {
    usuario(uid: $uid) {
      _id
      nombre
      roles {
        role
        readOnly
      }
      idInventario
      _idPunto
      infoPunto
      _idPuntoPrincipal
      clientes
      sinAlmacen
    }
  }
`;
export const NOTIFICACIONES_PUNTO = gql`
  query NotificacionesPunto {
    notificacionesPunto {
      notificaciones {
        nombre
        notificaciones {
          _id
          nombre
          leido
        }
      }
    }
  }
`;

export const NUEVA_VENTA_UTILS = gql`
  query NuevaVentaUtils {
    clientes {
      _id
      nombre
    }
    productos {
      productos {
        _id
        codigo
        nombre
        precio
      }
    }
    puntosActivos {
      plazasConInventarios {
        id
        in
        nombre
      }
    }
  }
`;

export const NUEVO_REGISTRO_INVENTARIO_UTILS = gql`
  query nuevoRegistroInventarioUtils($_id: String!) {
    inventario(_id: $_id, encrypt: true) {
      encrypted
    }
    productos {
      productos {
        _id
        codigo
        nombre
        precio
      }
    }
    prendasPorRegistrar(_id: $_id)
  }
`;

export const INVENTARIO = gql`
  query Inventario($_id: String!) {
    inventario(_id: $_id) {
      inv {
        codigo
        nombre
        a
        c
        pqs {
          p
          c
          id
          proceso
          tela
        }
      }
    }
  }
`;

export const PLAZA = gql`
  query plaza($_id: String!) {
    productos {
      productos {
        _id
        codigo
        nombre
        precio
      }
    }
    plaza(_id: $_id) {
      fecha
      nombre
      ce
      re
      path
      idInventario
      intercambios {
        _id
        esEmision
        Fecha: fecha
        Envia: nombreEmisor
        Recibe: nombreReceptor
        ar {
          a
          c
          pqs {
            p
            c
          }
        }
        discrepancias {
          a
          c
          pqs {
            p
            c
          }
        }
        ca
      }
      ventas {
        _id
        Fecha: fecha
        Nombre: nombre
        ar {
          a
          c
          pqs {
            p
            c
            dev
            mod
          }
          p
          dev
          mod
        }
        ca
        Monto: monto
        Comentarios: co
      }
      pagos {
        _id
        cliente
        Fecha: fecha
        Nombre: nombre
        Tipo: tipo
        Monto: monto
        Comentarios: comentarios
        ca
      }
      gastos {
        _id
        Fecha: fecha
        Descripcion: de
        Monto: mo
      }
    }
  }
`;

export const NUEVO_PAGO_UTILS = gql`
  query NuevoPagoUtils {
    clientes {
      _id
      nombre
    }
  }
`;

export const PRODUCTOS = gql`
  query Productos {
    productos {
      productos {
        _id
        codigo
        nombre
        precio
      }
    }
  }
`;
