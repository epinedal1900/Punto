/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
import { createRxDatabase, addRxPlugin } from 'rxdb';
import {
  RxCollection,
  RxCollectionCreatorBase,
  RxDatabase,
} from 'rxdb/dist/types/types';
import {
  calendarioRegistrosInventario_calendarioRegistrosInventario_dias,
  nuevaVentaClienteVariables,
  nuevaVentaPuntoDeVentaVariables,
  NuevaVentaUtils_clientes,
  NuevaVentaUtils_puntosActivos_plazasConInventarios,
  NuevoGastoVariables,
  nuevoIntercambioVariables,
  nuevoPagoVariables,
  plaza_plaza,
} from './types/apollo';
import { ArticulosValues, IntercambioValues, Ticket } from './types/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
addRxPlugin(require('pouchdb-adapter-idb'));

export interface TicketDb extends Ticket {
  eliminado: boolean;
}

export interface utils_productos {
  _id: string;
  codigo: string;
  nombre: string;
  precio: number;
}
export interface clientesDB {
  _id: 'clientes';
  clientes: NuevaVentaUtils_clientes[];
}
export interface utils {
  _id: string;
  productos?: utils_productos[];
  values?: string[];
  plazas_para_intercambios: NuevaVentaUtils_puntosActivos_plazasConInventarios[];
}
export interface mutation_variables {
  _id: 'mutationVariables';
  intercambio: Required<nuevoIntercambioVariables>[];
  venta_punto: Required<nuevaVentaPuntoDeVentaVariables>[];
  venta_cliente: Required<nuevaVentaClienteVariables>[];
  pago: Required<nuevoPagoVariables>[];
  gasto: Required<NuevoGastoVariables>[];
}

export interface plazaDB extends plaza_plaza {
  _id: string;
}
export interface intercambioDB extends IntercambioValues {
  _id: 'intercambio';
}

export interface registroInventarioDB extends ArticulosValues {
  _id: 'registro';
}
export interface calendarioDB {
  _id: 'calendario';
  dias: calendarioRegistrosInventario_calendarioRegistrosInventario_dias[];
}
export interface db {
  utils: RxCollection<utils>;
  ticket: RxCollection<TicketDb>;
  plaza: RxCollection<plazaDB>;
  mutation_variables: RxCollection<mutation_variables>;
  intercambio: RxCollection<intercambioDB>;
  clientes: RxCollection<clientesDB>;
  registro_inventario: RxCollection<registroInventarioDB>;
  calendario: RxCollection<calendarioDB>;
}

let dbPromise: Promise<RxDatabase<db>> | null = null;

const collections: { [name: string]: RxCollectionCreatorBase } = {
  utils: {
    schema: {
      title: 'utils',
      version: 3,
      type: 'object',
      properties: {
        productos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        values: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        plazas_para_intercambios: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
    migrationStrategies: {
      1: function () {
        return null;
      },
      2: function () {
        return null;
      },
      3: function () {
        return null;
      },
    },
  },
  ticket: {
    schema: {
      title: 'principal',
      version: 3,
      type: 'object',
      properties: {
        escaneos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        prendasSueltas: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        paquetesAbiertos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        precios: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        cliente: {
          type: ['string', 'object'],
        },
        nombre: {
          type: 'string',
        },
        esMenudeo: {
          type: 'boolean',
        },
        eliminado: {
          type: 'boolean',
        },
        articulo: {
          type: ['string', 'object'],
        },
        cantidad: {
          type: 'number',
        },
        tipoDePago: {
          type: 'string',
        },
        tipoDeImpresion: {
          type: 'string',
        },
        comentarios: {
          type: 'string',
        },
        cantidadPagada: {
          type: 'number',
        },
      },
    },
    migrationStrategies: {
      1: function () {
        return null;
      },
      2: function () {
        return null;
      },
      3: function () {
        return null;
      },
    },
  },
  intercambio: {
    schema: {
      title: 'principal',
      version: 0,
      type: 'object',
      properties: {
        escaneos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        prendasSueltas: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        paquetesAbiertos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        precios: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        tipoDeImpresion: {
          type: 'string',
        },
        plazaReceptora: {
          type: ['object', 'string'],
        },
      },
    },
  },
  registro_inventario: {
    schema: {
      title: 'registro_inventario',
      version: 0,
      type: 'object',
      properties: {
        escaneos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        prendasSueltas: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        paquetesAbiertos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        precios: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  },
  plaza: {
    schema: {
      title: 'plaza',
      version: 2,
      type: 'object',
      properties: {
        fecha: {
          type: 'string',
        },
        nombre: {
          type: 'string',
        },
        ce: {
          type: ['boolean', 'null'],
        },
        re: {
          type: ['boolean', 'null'],
        },
        path: {
          type: ['array', 'null'],
        },
        idInventario: {
          type: 'string',
        },
        intercambios: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        ventas: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        pagos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        gastos: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
    migrationStrategies: {
      1: function () {
        return null;
      },
      2: function () {
        return null;
      },
    },
  },
  mutation_variables: {
    schema: {
      title: 'mutation_variables',
      version: 1,
      type: 'object',
      properties: {
        intercambio: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        venta_punto: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        venta_cliente: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        pago: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        gasto: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
    migrationStrategies: {
      1: function () {
        return null;
      },
    },
  },
  clientes: {
    schema: {
      title: 'clientes',
      version: 0,
      type: 'object',
      properties: {
        clientes: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  },
  calendario: {
    schema: {
      title: 'calendario',
      version: 0,
      type: 'object',
      properties: {
        dias: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  },
};

const _create = async () => {
  const db = await createRxDatabase<db>({
    name: 'main',
    adapter: 'idb',
  });
  db.waitForLeadership();
  await db.addCollections(collections);
  return db;
};

export const get = (): Promise<RxDatabase<db>> => {
  if (!dbPromise) dbPromise = _create();
  return dbPromise;
};
