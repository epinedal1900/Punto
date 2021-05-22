/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
/* eslint-disable no-console */
/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { assign } from 'lodash';

import MenuBuilder from './menu';

const { PosPrinter } = require('electron-pos-printer');

const store = new Store();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];
  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1400,
    height: 900,
    minWidth: 1400,
    minHeight: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */
ipcMain.on('PRODUCTOS', (_event, data) => {
  store.set('productos', data);
});
ipcMain.on('PLAZA', (_event, data) => {
  store.set('plaza', data);
});
ipcMain.on('CLIENTES', (_event, data) => {
  store.set('clientes', data);
});
ipcMain.on('PAGOS_CLIENTES', (_event, data) => {
  let obj;
  if (store.has('pagosClientes')) {
    obj = store.get<any>('pagosClientes').concat(data);
  } else {
    obj = [data];
  }
  store.set('pagosClientes', obj);
});
ipcMain.on('VENTAS', (_event, data) => {
  let obj;
  if (store.has('ventas')) {
    obj = store.get('ventas').concat(data);
  } else {
    obj = [data];
  }
  store.set('ventas', obj);
});
ipcMain.on('VENTAS_CLIENTES', (_event, data) => {
  let obj;
  if (store.has('ventasClientes')) {
    obj = store.get('ventasClientes').concat(data);
  } else {
    obj = [data];
  }
  store.set('ventasClientes', obj);
});
ipcMain.on('GASTOS', (_event, data) => {
  let obj;
  if (store.has('gastos')) {
    obj = store.get('gastos').concat(data);
  } else {
    obj = [data];
  }
  store.set('gastos', obj);
});
ipcMain.on('REGRESOS', (_event, data) => {
  let obj;
  if (store.has('regresos')) {
    obj = store.get('regresos').concat(data);
  } else {
    obj = [data];
  }
  store.set('regresos', obj);
});
ipcMain.on('INTERCAMBIOS', (_event, data) => {
  let obj;
  if (store.has('intercambios')) {
    obj = store.get('intercambios').concat(data);
  } else {
    obj = [data];
  }
  store.set('intercambios', obj);
});
ipcMain.on('MOVIMIENTOS_OFFLINE', (_event, data) => {
  let obj;
  if (store.has('movimientosOffline')) {
    obj = store.get('movimientosOffline').concat(data);
  } else {
    obj = [data];
  }
  store.set('movimientosOffline', obj);
});
ipcMain.on('GASTOS_OFFLINE', (_event, data) => {
  let obj;
  if (store.has('gastosOffline')) {
    obj = store.get('gastosOffline').concat(data);
  } else {
    obj = [data];
  }
  store.set('gastosOffline', obj);
});
ipcMain.on('CANCELAR_MOVIMIENTO', (_event, data) => {
  let arr;
  let nuevoTipo = `${data.tipo} (cancelad${data.tipo
    .split(':')[0]
    .charAt(data.tipo.split(':')[0].length - 1)})`;
  if (data.tipo.split(':')[0] === 'venta' && data.tipo.split(':')[1]) {
    arr = store.get('ventasClientes').map((val) => {
      if (val._idOffline === data._idOffline) {
        const { objVenta } = val;
        assign(objVenta, { tipo: nuevoTipo });
        assign(val, { objVenta });
        return val;
      }
      return val;
    });
    store.set('ventasClientes', arr);
  } else if (data.tipo === 'venta') {
    arr = store.get('ventas').map((val) => {
      if (val._idOffline === data._idOffline) {
        const { objVenta } = val;
        assign(objVenta, { tipo: nuevoTipo });
        assign(val, { objVenta });
        return val;
      }
      return val;
    });
    store.set('ventas', arr);
  } else if (data.tipo.split(':')[0] === 'pago') {
    arr = store.get('pagosClientes').map((val) => {
      if (val._idOffline === data._idOffline) {
        const obj = JSON.parse(JSON.stringify(val.objPago));
        assign(obj, { tipo: nuevoTipo });
        assign(val, { objPago: obj });
        return val;
      }
      return val;
    });
    store.set('pagosClientes', arr);
  } else if (data.tipo === 'regreso') {
    arr = store.get('regresos').map((val) => {
      if (val._idOffline === data._idOffline) {
        const { obj } = val;
        assign(obj, { tipo: nuevoTipo });
        assign(val, { obj });
        return val;
      }
      return val;
    });
    store.set('regresos', arr);
  } else if (data.tipo.split(' ')[0] === 'salida') {
    nuevoTipo = `${data.tipo} (cancelada)`;
    arr = store.get('intercambios').map((val) => {
      if (val._idOffline === data._idOffline) {
        const { obj } = val;
        assign(obj, { tipo: nuevoTipo });
        assign(val, { obj });
        return val;
      }
      return val;
    });
    store.set('intercambios', arr);
  }
  const movimientos = store.get('movimientosOffline').map((val) => {
    if (val._id === data._idOffline) {
      assign(val, { Tipo: `Sin conexión: ${nuevoTipo}` });
      return val;
    }
    return val;
  });
  store.set('movimientosOffline', movimientos);
});
ipcMain.on('ELIMINAR_MOVIMIENTO', (_event, data) => {
  if (data.tipo === 'ventasClientes') {
    const arr = store.get('ventasClientes').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('ventasClientes', arr);
  } else if (data.tipo === 'ventas') {
    const arr = store.get('ventas').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('ventas', arr);
  } else if (data.tipo === 'pagosClientes') {
    const arr = store.get('pagosClientes').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('pagosClientes', arr);
  } else if (data.tipo === 'regresos') {
    const arr = store.get('regresos').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('regresos', arr);
  } else if (data.tipo === 'intercambios') {
    const arr = store.get('intercambios').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('intercambios', arr);
  } else if (data.tipo === 'gastos') {
    const arr = store.get('gastos').filter((val) => {
      return val._idOffline !== data._idOffline;
    });
    store.set('gastos', arr);
    const gastos = store.get('gastosOffline').filter((val) => {
      return val._id !== data._idOffline;
    });
    store.set('gastosOffline', gastos);
  }
  const movimientos = store.get('movimientosOffline').filter((val) => {
    return val._id !== data._idOffline;
  });
  store.set('movimientosOffline', movimientos);
});
ipcMain.on('STORE', (event) => {
  event.returnValue = store.store;
});
ipcMain.on('RESET_MOVIMIENTOS', () => {
  store.delete('movimientosOffline');
  store.delete('gastosOffline');
  store.delete('ventasClientes');
  store.delete('ventas');
  store.delete('pagosClientes');
  store.delete('gastos');
  store.delete('regresos');
  store.delete('intercambios');
});
ipcMain.on('PRINT', (_event, data) => {
  const options = {
    preview: false,
    width: data.ancho,
    margin: '0 0 0 0',
    copies: 1,
    silent: true,
    printerName: data.impresora,
    timeOutPerLine: 200,
    // pageSize: { height: 301000, width: 71000 }, // page size
  };
  const printerData = data.data;
  PosPrinter.print(printerData, options)
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
