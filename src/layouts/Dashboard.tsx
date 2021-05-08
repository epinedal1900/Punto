/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-multi-comp */
import React, { Suspense, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';

import Tooltip from '@material-ui/core/Tooltip';
import { Offline, Online } from 'react-detect-offline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useQuery, useMutation } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import PublishIcon from '@material-ui/icons/Publish';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InputIcon from '@material-ui/icons/Input';
import ObjectId from 'bson-objectid';
import { LinearProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { assign, omit } from 'lodash';
import { ListItems } from '../components/listItems';
import NotificacionesPopover from '../components/NotificacionesPopover';
import CancelDialog from '../components/CancelDialog';
import SuccessErrorMessage from '../components/SuccessErrorMessage';
import { NOTIFICACIONES_PUNTO, MOVIMIENTOS } from '../utils/queries';
import {
  MARCAR_LEIDOS_PUNTO,
  NUEVA_VENTA,
  NUEVO_PAGO,
  NUEVO_GASTO,
  NUEVO_REGRESO,
  NUEVO_INTERCAMBIO,
} from '../utils/mutations';
import { modificarOnline } from '../actions/sessionActions';
import { auth } from '../firebase';

const { ipcRenderer } = window.require('electron');

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    // eslint-disable-next-line no-dupe-keys
    width: theme.spacing(9),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const { children } = props;
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [noLeidos, setNoLeidos] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const notificacionesRef = useRef(null);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subirConfirmationOpen, setSubirConfirmationOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [nuevaVenta] = useMutation(NUEVA_VENTA);
  const [nuevoPago] = useMutation(NUEVO_PAGO);
  const [nuevoRegreso] = useMutation(NUEVO_REGRESO);
  const [nuevoGasto] = useMutation(NUEVO_GASTO);
  const [nuevoIntercambio] = useMutation(NUEVO_INTERCAMBIO);
  const { refetch: getMovimientos } = useQuery(MOVIMIENTOS, {
    variables: { _id: session.puntoIdActivo },
    skip: true,
  });
  const handleSubirClick = () => {
    setSubirConfirmationOpen(true);
  };
  const handleSubirClose = () => {
    if (!loading) {
      setSubirConfirmationOpen(false);
    }
  };
  const handleSubir = async () => {
    setLoading(true);
    const store = ipcRenderer.sendSync('STORE');
    let hayErrores = false;
    if (store.ventas && store.ventas.length) {
      await Promise.all(
        store.ventas.map(async (obj) => {
          if (obj.objVenta.tipo.indexOf('(') === -1) {
            const o = JSON.parse(JSON.stringify(obj.objVenta));
            assign(o, { _id: ObjectId(o._id) });
            await nuevaVenta({
              variables: {
                objVenta: o,
                puntoId: obj.puntoId,
                nombre: obj.nombre,
              },
            })
              .then((res) => {
                if (res.data.nuevaVenta.success === true) {
                  ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                    _idOffline: obj._idOffline,
                    tipo: 'ventas',
                  });
                } else {
                  hayErrores = true;
                }
              })
              .catch(() => {
                hayErrores = true;
              });
          } else {
            ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
              _idOffline: obj._idOffline,
              tipo: 'ventas',
            });
          }
        })
      );
    }
    if (store.ventasClientes && store.ventasClientes.length) {
      await Promise.all(
        store.ventasClientes.map(async (obj) => {
          if (obj.objVenta.tipo.indexOf('(') === -1) {
            const o = omit(obj, '_idOffline');
            await nuevaVenta({
              variables: o,
            })
              .then((res) => {
                if (res.data.nuevaVenta.success === true) {
                  ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                    _idOffline: obj._idOffline,
                    tipo: 'ventasClientes',
                  });
                } else {
                  hayErrores = true;
                }
              })
              .catch(() => {
                hayErrores = true;
              });
          } else {
            ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
              _idOffline: obj._idOffline,
              tipo: 'ventasClientes',
            });
          }
        })
      );
    }
    if (store.pagosClientes && store.pagosClientes.length) {
      await Promise.all(
        store.pagosClientes.map(async (obj) => {
          if (obj.objPago.tipo.indexOf('(') === -1) {
            const o = omit(obj, '_idOffline');
            await nuevoPago({
              variables: o,
            })
              .then((res) => {
                if (res.data.nuevoPago.success === true) {
                  ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                    _idOffline: obj._idOffline,
                    tipo: 'pagosClientes',
                  });
                } else {
                  hayErrores = true;
                }
              })
              .catch(() => {
                hayErrores = true;
              });
          } else {
            ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
              _idOffline: obj._idOffline,
              tipo: 'pagosClientes',
            });
          }
        })
      );
    }
    if (store.regresos && store.regresos.length) {
      await Promise.all(
        store.regresos.map(async (obj) => {
          if (obj.obj.tipo.indexOf('(') === -1) {
            const o = omit(obj, '_idOffline');
            await nuevoRegreso({
              variables: o,
            })
              .then((res) => {
                if (res.data.nuevoRegreso.success === true) {
                  ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                    _idOffline: obj._idOffline,
                    tipo: 'regresos',
                  });
                } else {
                  hayErrores = true;
                }
              })
              .catch(() => {
                hayErrores = true;
              });
          } else {
            ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
              _idOffline: obj._idOffline,
              tipo: 'regresos',
            });
          }
        })
      );
    }
    if (store.intercambios && store.intercambios.length) {
      await Promise.all(
        store.intercambios.map(async (obj) => {
          if (obj.obj.tipo.indexOf('(') === -1) {
            const o = omit(obj, '_idOffline');
            await nuevoIntercambio({
              variables: o,
            })
              .then((res) => {
                if (res.data.nuevoIntercambio.success === true) {
                  ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                    _idOffline: obj._idOffline,
                    tipo: 'intercambios',
                  });
                } else {
                  hayErrores = true;
                }
              })
              .catch(() => {
                hayErrores = true;
              });
          } else {
            ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
              _idOffline: obj._idOffline,
              tipo: 'intercambios',
            });
          }
        })
      );
    }
    if (store.gastos && store.gastos.length) {
      await Promise.all(
        store.gastos.map(async (obj) => {
          const o = omit(obj, '_idOffline');
          await nuevoGasto({
            variables: o,
          })
            .then((res) => {
              if (res.data.nuevoGasto.success === true) {
                ipcRenderer.send('ELIMINAR_MOVIMIENTO', {
                  _idOffline: obj._idOffline,
                  tipo: 'gastos',
                });
              } else {
                hayErrores = true;
              }
            })
            .catch(() => {
              hayErrores = true;
            });
        })
      );
    }
    await getMovimientos({ variables: { _id: session.puntoIdActivo } }).then(
      (data) => {
        ipcRenderer.send('PLAZA', data.data.movimientos);
      }
    );
    if (!hayErrores) {
      dispatch(modificarOnline({ online: true }));
      localStorage.setItem('online', 'true');
      setSuccess(true);
      setMessage('Cambios subidos');
    } else {
      // eslint-disable-next-line no-alert
      setMessage('No se pudieron subir todos los cambios, intente de nuevo');
    }
    setLoading(false);
    setSubirConfirmationOpen(false);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    auth.signOut();
  };
  useQuery(NOTIFICACIONES_PUNTO, {
    onCompleted: (data) => {
      if (session.nombre === 'Pasillo 2' || session.nombre === 'Pasillo 6') {
        const notificacionesArr = data.notificacionesPunto.find((val) => {
          return val.nombre === session.nombre;
        }).notificaciones;
        setNotificaciones(notificacionesArr);
        const i = notificacionesArr.reduce((acc, cur) => {
          if (cur.leido) {
            return acc;
          }
          return acc + 1;
        }, 0);
        setNoLeidos(i);
      }
    },
    skip: !session.online,
    errorPolicy: 'all',
    pollInterval: 5000,
  });

  const [marcarLeidos] = useMutation(MARCAR_LEIDOS_PUNTO, {
    onCompleted: (data) => {
      if (data.marcarLeidos.success === true) {
        setNoLeidos(0);
      }
    },
  });

  const handleExit = () => {
    setSuccess(null);
    setMessage(null);
  };
  const handlenotificacionesOpen = () => {
    if (noLeidos > 0) {
      marcarLeidos({ variables: { nombre: session.nombre } });
    }
    setOpenNotificaciones(true);
  };

  const handleActivarOffline = () => {
    dispatch(modificarOnline({ online: false }));
    localStorage.setItem('online', 'false');
    // eslint-disable-next-line no-alert
    alert('Modo sin conexión activado');
  };
  const handlenotificacionesClose = () => {
    setOpenNotificaciones(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, open && classes.appBarShift)}
        color={session.online ? 'primary' : 'default'}
        position="absolute"
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            aria-label="open drawer"
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
            color="inherit"
            edge="start"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.title}
            color="inherit"
            component="h1"
            noWrap
            variant="h6"
          >
            {session.nombre}
          </Typography>
          {!session.online && (
            <>
              <Online>
                <Tooltip title={<h2>Subir cambios</h2>}>
                  <IconButton color="inherit" onClick={handleSubirClick}>
                    <PublishIcon />
                  </IconButton>
                </Tooltip>
              </Online>
              <Offline>
                <WifiOffIcon />
              </Offline>
            </>
          )}
          {false && (
            <IconButton
              color="inherit"
              onClick={() => {
                ipcRenderer.send('RESET_MOVIMIENTOS');
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
          )}
          {session.online && (
            <Tooltip title={<h2>Activar modo sin conexión</h2>}>
              <IconButton
                color="inherit"
                disabled={!session.puntoIdActivo}
                onClick={handleActivarOffline}
              >
                <PowerOffIcon />
              </IconButton>
            </Tooltip>
          )}
          {(session.nombre === 'Pasillo 2' ||
            session.nombre === 'Pasillo 6') && (
            <Tooltip title={<h2>Notificaciones</h2>}>
              <IconButton
                ref={notificacionesRef}
                color="inherit"
                disabled={!session.online}
                onClick={handlenotificacionesOpen}
              >
                <Badge
                  badgeContent={session.puntoIdActivo ? noLeidos : 0}
                  color="secondary"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={<h2>Cerrar sesión</h2>}>
            <IconButton
              color="inherit"
              disabled={!session.online}
              onClick={handleLogout}
            >
              <InputIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <NotificacionesPopover
          anchorEl={notificacionesRef.current}
          notificaciones={session.puntoIdActivo ? notificaciones : []}
          onClose={handlenotificacionesClose}
          open={openNotificaciones}
        />
      </AppBar>
      <Drawer
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
        variant="permanent"
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <ListItems />
      </Drawer>
      <CancelDialog
        handleCancel={handleSubir}
        handleClose={handleSubirClose}
        loading={loading}
        message="¿Está seguro de que desea subir los cambios?"
        open={subirConfirmationOpen}
      />
      <SuccessErrorMessage
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        handleExit={handleExit}
        message={message}
        success={success}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>
          <Suspense fallback={<LinearProgress />}>{children}</Suspense>
        </Container>
      </main>
    </div>
  );
}
