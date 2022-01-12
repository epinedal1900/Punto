/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-else-return */
import dayjs from 'dayjs';
import ObjectID from 'bson-objectid';
import { assign, groupBy, omit } from 'lodash';
import { RxDatabase, RxDocument } from 'rxdb';
import { History } from 'history';

import { PRODUCTOS } from './queries';
import {
  calendarioRegistrosInventario_calendarioRegistrosInventario_dias,
  Inventario_inventario_inv,
  NuevaVentaUtils_clientes,
  NuevaVentaUtils_puntosActivos_plazasConInventarios,
  NuevoPagoUtils_clientes,
  plaza,
  plaza_plaza,
  plaza_plaza_intercambios_ar,
  PrendasNuevaVenta,
  PrendasNuevoRegistro,
  Productos,
  Productos_productos_productos,
} from '../types/apollo';

import {
  ArticulosValues,
  DatosTablaPrendas,
  FormikSetErrors,
  FormikSetValues,
  ImpresionDeTicketsArgs,
  ImpresionDeTicketsSinPreciosArgs,
  NombreTickets,
  PlazaState,
  PqsRevision,
  PrendasInventario,
  PrendasRevision,
  PrincipalValues,
  Qr,
  SessionState,
  SetState,
} from '../types/types';
import * as Database from '../Database';
import client from './client';
import {
  ArticulosInitialValues,
  IntercambiosInitialValues,
  TicketsInitialValues,
} from './Constants';
import { store } from '../store';

interface AgruparArticulosArg extends ArticulosValues {
  [x: string]: any;
}
export const aFormatoDeDinero = (n: number): string => {
  const s = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n);
  return s;
};
export const fechaPorId = (_id: ObjectID, format?: boolean) => {
  if (format) {
    return dayjs(_id.getTimestamp()).format('DD/MM/YYYY');
  }
  return dayjs(_id.getTimestamp()).toISOString();
};
export const aFormatoDeNumero = (n: number): string => {
  const s = Intl.NumberFormat('en-US').format(n);
  return s;
};

export const prendaIdDeQR = (qr: string): string => {
  return qr.slice(6, 30);
};
export const procesoIdDeQR = (qr: string): string => {
  return qr.slice(30, 54);
};
export const actualizarProductos = async (
  db: RxDatabase<Database.db>
): Promise<any[]> => {
  let productos: any[] = [];
  await client
    .query<Productos>({
      query: PRODUCTOS,
    })
    .then(async (data) => {
      if (data.data.productos?.productos) {
        productos = data.data.productos.productos;
        await db.collections.utils.upsert({
          _id: 'productos',
          productos,
        });
      }
    });
  return productos;
};

export const obtenerProductos = async (
  db: RxDatabase<Database.db>
): Promise<Database.utils_productos[]> => {
  let productos: Database.utils_productos[] | undefined;
  await db.collections.utils
    .findOne({
      selector: { _id: 'productos' },
    })
    .exec()
    .then((doc) => {
      productos = doc?.productos;
    });
  if (productos) {
    return productos;
  } else if (store.getState().plaza.online) {
    await actualizarProductos(db).then((data) => {
      productos = data;
    });
    return productos || [];
  } else {
    return [];
  }
};

export const cantidadDePrendasInventario = (
  prendas: PrendasNuevoRegistro[]
): number => {
  const cantidad = prendas.reduce((acc, cur) => {
    let cant = 0;
    if (cur) {
      cant =
        acc +
        cur.c +
        cur.pqs.reduce((ac, cu) => {
          return ac + cu.c;
        }, 0);
    }
    return cant;
  }, 0);
  return cantidad;
};

const celdaDeTicket = (
  value: string | number,
  resaltar?: boolean,
  derecha?: boolean
) => {
  const cssResaltar = {
    'font-weight': '800',
    'font-size': '11px',
    'font-family': 'sans-serif',
  };
  const obj = {
    type: 'text',
    value,
    style: `text-align:${derecha ? 'right' : 'left'};`,
    css: resaltar
      ? cssResaltar
      : {
          'font-size': '11px',
          'font-family': 'sans-serif',
        },
  };
  return obj;
};

export const crearTicketData = (args: ImpresionDeTicketsArgs) => {
  const fecha = dayjs(args.fecha).format('DD/MM/YYYY-HH:mm');
  let header = args.infoPunto + fecha;
  if (args.cliente) {
    header += `<br> ${args.cliente}`;
  }
  const total = args.articulos.reduce((acc, cur) => {
    const precio = cur.Precio || 0;
    return acc + precio * cur.Cantidad;
  }, 0);
  const NoDeArticulos = args.articulos.reduce((acc, cur) => {
    return acc + cur.Cantidad;
  }, 0);
  const tableBody = args.articulos.map((r) => {
    const precio = r.Precio || 0;
    const obj = [
      celdaDeTicket(r.Cantidad),
      celdaDeTicket(r.Nombre),
      celdaDeTicket(aFormatoDeDinero(precio)),
      celdaDeTicket(aFormatoDeDinero(precio * r.Cantidad)),
    ];
    return obj;
  });
  tableBody.push(
    [
      celdaDeTicket(''),
      celdaDeTicket(''),
      celdaDeTicket('No. de prendas:'),
      celdaDeTicket(NoDeArticulos),
    ],
    [
      celdaDeTicket(''),
      celdaDeTicket(''),
      celdaDeTicket('Total:', false, true),
      celdaDeTicket(aFormatoDeDinero(total), true, true),
    ]
  );
  if (args.cantidadPagada && args.cambio && !args.cliente) {
    tableBody.push(
      [
        celdaDeTicket(''),
        celdaDeTicket(''),
        celdaDeTicket('Pago:', false, true),
        celdaDeTicket(aFormatoDeDinero(args.cantidadPagada), false, true),
      ],
      [
        celdaDeTicket(''),
        celdaDeTicket(''),
        celdaDeTicket('Cambio:', false, true),
        celdaDeTicket(aFormatoDeDinero(args.cambio), false, true),
      ]
    );
  }
  const data = [
    {
      type: 'text',
      value: header,
      css: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        'text-align': 'center',
      },
    },
    {
      type: 'table',
      style: 'border: 1px; text-align: left ',
      tableHeader: ['Cant.', 'Prenda', 'Precio', 'Importe'],
      tableBody,
      tableHeaderStyle: 'background-color: white ; color: #000;',
      tableBodyStyle: 'border: 2px solid #ddd',
    },
    {
      type: 'text',
      value: 'Gracias por su compra!<br><br>',
      css: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        'text-align': 'center',
      },
    },
  ];
  return data;
};

export const crearTicketSinPrecioData = (
  args: ImpresionDeTicketsSinPreciosArgs
) => {
  const fecha = `${dayjs(args.fecha).format('DD/MM/YYYY-HH:mm')}`;
  const header = args.infoPunto + fecha;
  const NoDeArticulos = cantidadDePrendasInventario(args.articulos);
  const tableBody: any[] = [];
  args.articulos.forEach((r) => {
    const obj = [celdaDeTicket(r.nombre), celdaDeTicket(r.c)];
    r.pqs.forEach((p) => {
      const paq = [celdaDeTicket(p.id, false, true), celdaDeTicket(p.c)];
      tableBody.push(paq);
    });
    tableBody.push(obj);
  });
  tableBody.push([
    celdaDeTicket('No. de prendas:'),
    celdaDeTicket(NoDeArticulos),
  ]);
  const data = [
    {
      type: 'text',
      value: header,
      css: {
        'font-size': '14px',
        'font-family': 'sans-serif',
        'text-align': 'center',
      },
    },
    {
      type: 'table',
      style: 'border: 2px; text-align: left ',
      tableHeader: ['Cantidad', 'Prenda'],
      tableBody,
      tableHeaderStyle: 'background-color: white ; color: #000;',
      tableBodyStyle: 'border: 2px solid #ddd',
    },
  ];
  return data;
};

export const makeColumns = (headers: string[]): any => {
  return headers.map((column, i) => {
    const obj: any = {
      Header: column,
      accessor: column,
    };
    if (i === 0) {
      obj.width = 20;
    }
    if (['Cantidad', 'cantidad', 'Prendas'].includes(column)) {
      obj.Cell = ({ value }: any) => {
        if (value == null) {
          return null;
        } else {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      };
    }
    if (
      ['Total', 'Precio', 'Balance', 'Monto', 'precio', 'Descuento'].includes(
        column
      )
    ) {
      obj.Cell = ({ value }: any) => {
        if (Number.isNaN(parseFloat(value))) {
          return value;
        }
        return aFormatoDeDinero(value);
      };
    }
    if (['Registro', 'Fecha	', 'Fecha'].includes(column)) {
      obj.Cell = ({ value }: any) => dayjs(value).format('DD/MM/YYYY-HH:mm');
      obj.sortMethod = (a: any, b: any) => {
        const a1 = new Date(a).getTime();
        const b1 = new Date(b).getTime();
        if (a1 < b1) return 1;
        if (a1 > b1) return -1;
        return 0;
      };
    }
    if (column === 'Entrega') {
      obj.Cell = ({ value }: any) => dayjs(value).format('DD/MM/YYYY');
      obj.sortMethod = (a: any, b: any) => {
        const a1 = new Date(a).getTime();
        const b1 = new Date(b).getTime();
        if (a1 < b1) return 1;
        if (a1 > b1) return -1;
        return 0;
      };
    }
    return obj;
  });
};

const agruparArticulosParaRegistroProcesarQr = (
  val: Qr,
  abrirPaquetes: boolean
) => {
  let c;
  let pqAPrendaSuelta;
  if (abrirPaquetes) {
    c = val.cantidad;
    pqAPrendaSuelta = val.piezas - val.cantidad;
  } else {
    c = val.cantidad * val.piezas;
    pqAPrendaSuelta = 0;
  }
  return {
    a: prendaIdDeQR(val.qr),
    nombre: val.nombre,
    c: 0,
    pqs: [
      {
        p: procesoIdDeQR(val.qr),
        id: val.id,
        c,
        pqAPrendaSuelta,
      },
    ],
  };
};

const quitarCamposDeRevision = (v: PrendasRevision) => {
  const rest = omit(v, 'nombre', 'pqs');
  const PQS = v.pqs.map((q) => {
    const r = omit(q, 'id');
    return r;
  });
  return { ...rest, pqs: PQS };
};
export const agruparArticulosParaRegistro = (
  values: AgruparArticulosArg
): { prendas: PrendasNuevoRegistro[]; revision: PrendasRevision[] } => {
  const { escaneos, prendasSueltas } = values;
  const prendasSueltasRevision: PrendasRevision[] = prendasSueltas.map(
    (val) => {
      return {
        a: val.articulo._id,
        c: val.cantidad,
        nombre: val.articulo.nombre,
        pqs: [],
      };
    }
  );
  const escaneosRevision = escaneos.map((qr) => {
    return agruparArticulosParaRegistroProcesarQr(qr, false);
  });

  const prendasAgrupadasRevisionArr = groupBy(
    prendasSueltasRevision.concat(escaneosRevision),
    'a'
  );
  const revision = Object.keys(prendasAgrupadasRevisionArr).map((key) => {
    const pqs = prendasAgrupadasRevisionArr[key].reduce<PqsRevision[]>(
      (acc, cur) => {
        return acc.concat(cur.pqs);
      },
      []
    );
    const procesosAgrupados = groupBy(pqs, 'p');
    const procesosAgrupadosObj = Object.keys(procesosAgrupados).map((k) => {
      return {
        p: k,
        id: procesosAgrupados[k][0].id,
        c: procesosAgrupados[k].reduce((acc, cur) => {
          return acc + cur.c;
        }, 0),
        pqAPrendaSuelta: procesosAgrupados[k].reduce((acc, cur) => {
          const c = cur.pqAPrendaSuelta || 0;
          return acc + c;
        }, 0),
      };
    });
    return {
      a: key,
      nombre: prendasAgrupadasRevisionArr[key][0].nombre,
      c: prendasAgrupadasRevisionArr[key].reduce((acc, cur) => {
        return acc + cur.c;
      }, 0),
      pqs: procesosAgrupadosObj,
    };
  });
  const prendas = revision.map(quitarCamposDeRevision);
  return { prendas, revision };
};

export const agruparArticulosParaVenta = (
  values: AgruparArticulosArg
): { prendas: PrendasNuevaVenta[]; revision: PrendasRevision[] } => {
  const { precios } = values;
  const { revision } = agruparArticulosParaRegistro(values);
  const revisionConPrecios: PrendasRevision[] = revision.map((prenda) => {
    let precio = 0;
    const prendaEnPrecios = precios.find((v) => {
      return v && v._id === prenda.a;
    });
    if (prendaEnPrecios) {
      precio = prendaEnPrecios.precio;
    } else {
      alert('No se encontró el precio de algunas prendas');
    }
    prenda.p = precio;
    return prenda;
  });
  const prendas = revisionConPrecios.map(quitarCamposDeRevision);
  // @ts-expect-error: se asigna p
  return { prendas, revision: revisionConPrecios };
};

export const encontrarDiscrepanciasDePrendas = (
  prendasRegistradas: PrendasRevision[],
  prendasEsperadas: Inventario_inventario_inv[],
  soloDePrendasRegistradas = false
): { prendas: PrendasNuevoRegistro[]; revision: PrendasRevision[] } => {
  const revision: PrendasRevision[] = [];
  const indexes: number[] = [];

  prendasRegistradas.forEach((pR) => {
    const indexPrendaEsperada = prendasEsperadas.findIndex((pE) => {
      return pE.a === pR.a;
    });
    let prendaEsperada: Inventario_inventario_inv | undefined;
    if (indexPrendaEsperada !== -1) {
      indexes.push(indexPrendaEsperada);
      prendaEsperada = prendasEsperadas[indexPrendaEsperada];
    }
    const cS = prendaEsperada?.c || 0;
    const idxs: number[] = [];
    const pqs: PqsRevision[] = prendaEsperada
      ? []
      : pR.pqs.map((pp) => {
          const { c, ...rest } = pp;
          return {
            ...rest,
            c: -c,
          };
        });
    pR.pqs.forEach((pq) => {
      if (prendaEsperada) {
        const idxPqEsperado = prendaEsperada.pqs.findIndex((pqe) => {
          return pqe.p === pq.p;
        });
        if (idxPqEsperado !== -1) idxs.push(idxPqEsperado);
        const c = prendaEsperada.pqs[idxPqEsperado]?.c || 0;
        if (c - pq.c !== 0) pqs.push({ p: pq.p, id: pq.id, c: c - pq.c });
      }
    });
    prendaEsperada?.pqs.forEach((pqe, i) => {
      if (!idxs.includes(i)) {
        pqs.push({ p: pqe.p, id: pqe.id, c: pqe.c });
      }
    });
    if (
      cS - pR.c !== 0 ||
      pqs.some((p) => {
        return p.c !== 0;
      })
    ) {
      revision.push({
        a: pR.a,
        c: cS - pR.c,
        pqs,
        nombre: pR.nombre,
      });
    }
  });
  if (!soloDePrendasRegistradas) {
    prendasEsperadas.forEach((prenda, i) => {
      if (!indexes.includes(i)) {
        revision.push({
          a: prenda.a,
          c: prenda.c,
          nombre: prenda.nombre,
          pqs: prenda.pqs,
        });
      }
    });
  }
  const prendas = revision.map(quitarCamposDeRevision);
  return { prendas, revision };
};

export const montoPrendasNuevaVenta = (
  prendas: PrendasNuevaVenta[]
): number => {
  const total = prendas.reduce((acc, cur) => {
    let cant = 0;
    if (cur) {
      cant =
        acc +
        cur.c * cur.p +
        cur.p *
          cur.pqs.reduce((ac, cu) => {
            return ac + cu.c;
          }, 0);
    }
    return cant;
  }, 0);
  return total;
};
export const montoDeArticulosEscaner = (values: PrincipalValues): number => {
  const precios: any = {};
  values.precios.forEach((precio) => {
    if (precio) {
      precios[precio._id] = precio.precio || 0;
    }
  });
  const total =
    values.prendasSueltas.reduce((acc, cur) => {
      const precio = precios[cur.articulo._id] || 0;
      return acc + cur.cantidad * precio;
    }, 0) +
    values.escaneos.reduce((acc, cur) => {
      const precio = precios[prendaIdDeQR(cur.qr)] || 0;
      return acc + cur.cantidad * cur.piezas * precio;
    }, 0);

  return total;
};

export const cantidadEnPrenda = (prenda: PrendasInventario): number => {
  const cant =
    prenda.c +
    prenda.pqs.reduce((ac, cu) => {
      return ac + cu.c;
    }, 0);
  return cant;
};

interface Prendas {
  [x: string]: any;
  pqs: { [x: string]: any; c: number; p: string }[];
  c: number;
  a: string;
  p?: number;
}

export const resolverPrendasObject = async <T extends { a: string }>(
  prendas: T[]
): Promise<(T & { nombre: string })[]> => {
  const db = await Database.get();
  let productos = await obtenerProductos(db);
  let huboBusqueda = false;
  const res = await Promise.all(
    prendas.map(async (prenda) => {
      let producto = productos.find((val) => {
        return val._id.toString() === prenda.a;
      });
      if (!producto && !huboBusqueda) {
        huboBusqueda = true;
        await actualizarProductos(db).then((data) => {
          productos = data;
          producto = productos.find((val) => {
            return val._id.toString() === prenda.a;
          });
        });
      }
      return {
        ...prenda,
        nombre: producto?.nombre || 'prenda no definida',
      };
    })
  );
  return res;
};

export const intercambioArAPrendasRevision = async (
  ar: plaza_plaza_intercambios_ar[]
): Promise<PrendasRevision[]> => {
  const prendas = await resolverPrendasObject(ar);
  return prendas.map((v) => {
    return {
      a: v.a,
      c:
        v.c +
        v.pqs.reduce((acc, cur) => {
          return acc + cur.c;
        }, 0),
      nombre: v.nombre,
      pqs: [],
      p: 0,
    };
  });
};

export const datosParaTablaDePrendas = async (
  prendas: Prendas[]
): Promise<DatosTablaPrendas[]> => {
  const prendasResueltas = await resolverPrendasObject(prendas);
  return prendasResueltas.map((values) => {
    const obj = {
      Nombre: values.nombre,
      Cantidad:
        values.c +
        values.pqs.reduce((acc, cur) => {
          return acc + cur.c;
        }, 0),
    };
    if (values.p) {
      assign(obj, { Precio: values.p });
    }
    return obj;
  });
};

export const resolverPrendas = async (
  prendas: string[]
): Promise<{ nombre: string; precio: number }[]> => {
  const db = await Database.get();
  let productos = await obtenerProductos(db);
  let huboBusqueda = false;
  const res = await Promise.all(
    prendas.map(async (prenda) => {
      let producto = productos.find((val) => {
        return val._id.toString() === prenda;
      });
      if (!producto && !huboBusqueda) {
        huboBusqueda = true;
        await actualizarProductos(db).then((data) => {
          productos = data;
          producto = productos.find((val) => {
            return val._id.toString() === prenda;
          });
        });
      }
      return {
        nombre: producto?.nombre || 'prenda no definida',
        precio: producto?.precio || 0,
      };
    })
  );
  return res;
};

export const obtenerPrincipalSinConexion = (
  db: RxDatabase<Database.db> | null,
  setProductos: SetState<Productos_productos_productos[]>,
  setClientes?: SetState<NuevaVentaUtils_clientes[]>,
  setPlazasParaIntercambios?: SetState<
    NuevaVentaUtils_puntosActivos_plazasConInventarios[]
  >
): void => {
  const obtener = async () => {
    if (db) {
      const productos = await obtenerProductos(db);
      setProductos(productos);
      if (setClientes) {
        let clientes: NuevaVentaUtils_clientes[] | undefined;
        await db.collections.clientes
          .findOne({
            selector: { _id: 'clientes' },
          })
          .exec()
          .then((doc) => {
            clientes = doc?.clientes;
          });
        setClientes(clientes || []);
      }
      if (setPlazasParaIntercambios) {
        let plazas:
          | NuevaVentaUtils_puntosActivos_plazasConInventarios[]
          | undefined;
        await db.collections.utils
          .findOne({
            selector: { _id: 'plazas_para_intercambios' },
          })
          .exec()
          .then((doc) => {
            plazas = doc?.plazas_para_intercambios;
          });

        setPlazasParaIntercambios(plazas || []);
      }
    }
  };
  obtener();
};
export const procesarDiasCalendario = async (
  dias: calendarioRegistrosInventario_calendarioRegistrosInventario_dias[]
) => {
  const diasArr = dias.map(async (dia) => {
    const prendas = await resolverPrendas(
      dia.prendas.map((v) => {
        return v.id;
      })
    );
    const prendasSorted = dia.prendas.map((v, i) => {
      return { id: prendas[i].nombre, reg: v.reg };
    });
    prendasSorted.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    return {
      fecha: dia.fecha,
      prendas: prendasSorted,
    };
  });
  const d = await Promise.all(diasArr);
  return d;
};
export const obtenerCalendarioSinConexion = (
  db: RxDatabase<Database.db> | null,
  setDias: SetState<
    calendarioRegistrosInventario_calendarioRegistrosInventario_dias[]
  >,
  setLoading: SetState<boolean>
): void => {
  const obtener = async () => {
    if (db) {
      let diasArr: calendarioRegistrosInventario_calendarioRegistrosInventario_dias[] = [];
      await db.collections.calendario
        .findOne({
          selector: { _id: 'calendario' },
        })
        .exec()
        .then((doc) => {
          diasArr = doc?.toJSON().dias || [];
        });
      setDias(diasArr);
      setLoading(false);
    }
  };
  obtener();
};
export const obtenerPlazaSinConexion = (
  db: RxDatabase<Database.db> | null,
  _id: string,
  setPlazaData: SetState<plaza | null>
): void => {
  const obtener = async () => {
    if (db) {
      let plazaObj: plaza_plaza | undefined;
      await db.collections.plaza
        .findOne({
          selector: { _id },
        })
        .exec()
        .then((doc) => {
          plazaObj = omit(doc?.toJSON(), '_id');
        });
      const productos = await obtenerProductos(db);
      setPlazaData({ plaza: plazaObj || null, productos: { productos } });
    }
  };
  obtener();
};
export const actualizarPrincipalEffect = (
  db: RxDatabase<Database.db> | null,
  productos: Productos_productos_productos[],
  clientes: NuevoPagoUtils_clientes[],
  plazasParaIntercambios: NuevaVentaUtils_puntosActivos_plazasConInventarios[]
): void => {
  if (db) {
    if (productos.length > 0) {
      db.collections.utils.upsert({
        _id: 'productos',
        productos,
      });
    }
    db.collections.clientes.upsert({
      _id: 'clientes',
      clientes,
    });
    db.collections.utils.upsert({
      _id: 'plazas_para_intercambios',
      plazas_para_intercambios: plazasParaIntercambios,
    });
  }
};
export const actualizarPlazaEffect = (
  db: RxDatabase<Database.db> | null,
  loading: boolean,
  plazaObj: plaza | null,
  _id: string
): void => {
  if (plazaObj?.productos?.productos && db && !loading) {
    db.collections.utils.upsert({
      _id: 'productos',
      productos: plazaObj?.productos?.productos,
    });
  }
  if (plazaObj?.plaza && db && !loading) {
    db.collections.plaza.upsert({
      _id,
      ...plazaObj?.plaza,
    });
  }
};
export const actualizarCalendarioEffect = (
  db: RxDatabase<Database.db> | null,
  loading: boolean,
  dias: calendarioRegistrosInventario_calendarioRegistrosInventario_dias[]
): void => {
  if (!loading && dias && db) {
    db.collections.calendario.upsert({
      _id: 'calendario',
      dias,
    });
  }
};

export const obtenerPrincipalValues = (
  db: RxDatabase<Database.db> | null,
  _id: string,
  setValues: FormikSetValues<PrincipalValues>,
  setErrors: FormikSetErrors<PrincipalValues>,
  setDoc: (a: RxDocument<Database.TicketDb, {}> | null) => void,
  docIntercambio: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  > | null
): void => {
  const ticket = async () => {
    if (db && _id !== '/' && _id !== '') {
      const intercambioValues: any = docIntercambio
        ? omit(docIntercambio.toJSON(), '_id')
        : IntercambiosInitialValues;
      let rxDoc: RxDocument<Database.TicketDb, {}> | undefined;
      await db.collections.ticket
        .findOne({
          selector: { _id },
        })
        .exec()
        .then((res) => {
          rxDoc = res || undefined;
        });
      if (typeof rxDoc !== 'undefined') {
        const values = rxDoc.toJSON();
        if (!values.eliminado) {
          setValues({ ...values, intercambioValues });
        } else {
          await rxDoc.update({
            $set: {
              eliminado: false,
              ...omit(TicketsInitialValues, '_id'),
            },
          });
          setValues({ ...TicketsInitialValues, intercambioValues });
        }
      } else {
        rxDoc = await db.collections.ticket.insert({
          ...TicketsInitialValues,
          _id,
          eliminado: false,
        });
        setValues(
          {
            ...TicketsInitialValues,
            intercambioValues,
          },
          false
        );
      }
      setErrors({});
      setDoc(rxDoc);
    }
  };
  if (db) {
    ticket();
  }
};

export const obtenerRegistroInventario = (
  db: RxDatabase<Database.db> | null,
  setValues: FormikSetValues<ArticulosValues>,
  setDoc: (
    a: RxDocument<
      Database.registroInventarioDB | Database.intercambioDB,
      {}
    > | null
  ) => void
): void => {
  const registro = async () => {
    if (db) {
      let rxDoc: RxDocument<Database.registroInventarioDB, {}> | undefined;
      await db.collections.registro_inventario
        .findOne({
          selector: { _id: 'registro' },
        })
        .exec()
        .then((res) => {
          rxDoc = res || undefined;
        });
      if (typeof rxDoc !== 'undefined') {
        const values = omit(rxDoc.toJSON(), '_id');
        setValues(values);
      } else {
        rxDoc = await db.collections.registro_inventario.insert({
          ...ArticulosInitialValues,
          _id: 'registro',
        });
        setValues(
          {
            ...ArticulosInitialValues,
          },
          false
        );
      }
      // @ts-expect-error:err
      setDoc(rxDoc);
    }
  };
  if (db) {
    registro();
  }
};
export const restablecerTicket = async (
  doc: RxDocument<Database.TicketDb>
): Promise<void> => {
  await doc.update({
    $set: {
      ...omit(TicketsInitialValues, '_id'),
    },
  });
};
export const eliminarTicket = async (
  doc: RxDocument<Database.TicketDb>
): Promise<void> => {
  await doc.update({
    $set: {
      eliminado: true,
    },
    $unset: {
      escaneos: '',
      prendasSueltas: '',
      precios: '',
      cliente: '',
      nombre: '',
      esMenudeo: '',
      articulo: '',
      cantidad: '',
      tipoDePago: '',
      tipoDeImpresion: '',
      comentarios: '',
      cantidadPagada: '',
    },
  });
};

export const obtenerNombresTickets = (
  db: RxDatabase<Database.db> | null,
  setNombresTickets: SetState<NombreTickets[]>,
  history: History<unknown>
): void => {
  const tickets = async () => {
    if (db) {
      const nombres = await db.collections.ticket.find().exec();
      if (nombres[0]._id === '/') {
        await eliminarTicket(nombres[0]);
      }
      const n: NombreTickets[] = [];
      nombres.forEach((v) => {
        if (!v.eliminado) {
          n.push({ _id: v._id, nombre: v.nombre || null });
        }
      });
      setNombresTickets(n);
      if (n[0] && n[0]._id[0] === '?') history.replace(`/${n[0]._id}`);
      if (n.length === 0) {
        const _id = encodeURI(`?ticket ${1}`);
        setNombresTickets([{ _id, nombre: null }]);
        history.replace(`/${_id}`);
      }
    }
  };
  if (db) {
    tickets();
  }
};

export const obtenerDocsPrincipal = (
  db: RxDatabase<Database.db> | null,
  sessionState: SessionState,
  plazaState: PlazaState,
  setMutationVariablesDoc: SetState<RxDocument<
    Database.mutation_variables
  > | null>,
  setPlazaDoc?: SetState<RxDocument<Database.plazaDB> | null>,
  setDocIntercambio?: SetState<RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  > | null>
): void => {
  const obtenerDocs = async () => {
    if (db) {
      let rxMutationDoc: RxDocument<Database.mutation_variables> | undefined;

      await db.collections.mutation_variables
        .findOne({
          selector: { _id: 'mutationVariables' },
        })
        .exec()
        .then((res) => {
          rxMutationDoc = res || undefined;
        });
      if (typeof rxMutationDoc === 'undefined') {
        rxMutationDoc = await db.collections.mutation_variables.upsert({
          _id: 'mutationVariables',
          intercambio: [],
          venta_punto: [],
          venta_cliente: [],
          pago: [],
          gasto: [],
        });
      }
      setMutationVariablesDoc(rxMutationDoc || null);

      if (setPlazaDoc) {
        let rxPlazaDoc: RxDocument<Database.plazaDB> | undefined;
        await db.collections.plaza
          .findOne({
            selector: { _id: plazaState._idPunto },
          })
          .exec()
          .then((res) => {
            rxPlazaDoc = res || undefined;
          });
        if (typeof rxPlazaDoc === 'undefined' && plazaState._idPunto) {
          rxPlazaDoc = await db.collections.plaza.upsert({
            _id: plazaState._idPunto,
            fecha: dayjs().toISOString(),
            nombre: sessionState.nombre || '',
            ce: false,
            re: null,
            path: null,
            idInventario: plazaState.idInventario,
            intercambios: [],
            ventas: [],
            pagos: [],
            gastos: [],
          });
        }
        setPlazaDoc(rxPlazaDoc || null);
      }
      if (setDocIntercambio) {
        let rxDocIntercambio:
          | RxDocument<Database.intercambioDB | Database.registroInventarioDB>
          | undefined;

        await db.collections.intercambio
          .findOne({
            selector: { _id: 'intercambio' },
          })
          .exec()
          .then((res) => {
            // @ts-expect-error:error
            rxDocIntercambio = res || undefined;
          });

        if (!rxDocIntercambio?.escaneos) {
          rxDocIntercambio?.update({ $set: { ...ArticulosInitialValues } });
        }
        if (typeof rxDocIntercambio === 'undefined') {
          // @ts-expect-error:error
          rxDocIntercambio = await db.collections.intercambio.upsert({
            _id: 'intercambio',
            ...IntercambiosInitialValues,
          });
        }
        setDocIntercambio(rxDocIntercambio || null);
      }
    }
  };
  if (db) {
    obtenerDocs();
  }
};

export const obtenerDB = (
  db: RxDatabase<Database.db> | null,
  setDb: (a: RxDatabase<Database.db> | null) => void
): void => {
  const getDb = async () => {
    const database = await Database.get();
    setDb(database);
  };
  if (!db) {
    getDb();
  }
};

export const restablecerIntercambio = async (
  doc: RxDocument<Database.intercambioDB | Database.registroInventarioDB>
): Promise<void> => {
  doc.update({ $set: { ...IntercambiosInitialValues } });
};
export const restablecerRegistroInventario = async (
  doc: RxDocument<Database.intercambioDB | Database.registroInventarioDB>
): Promise<void> => {
  doc.update({ $set: { ...ArticulosInitialValues } });
};
