/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';

import Tooltip from '@material-ui/core/Tooltip';
// @ts-expect-error:errr
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
import InputIcon from '@material-ui/icons/Input';
import { keys, omit } from 'lodash';
import { RxDatabase, RxDocument } from 'rxdb';

import { LinearProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { ListItems } from '../components/listItems';
import NotificacionesPopover from '../components/NotificacionesPopover';
import CancelDialog from '../components/CancelDialog';
import SuccessErrorMessage from '../components/SuccessErrorMessage';
import { RootState } from '../types/store';
import { auth } from '../firebase';
import * as Database from '../Database';
import {
  MarcarLeidos,
  MarcarLeidosVariables,
  NotificacionesPunto,
  NotificacionesPunto_notificacionesPunto_notificaciones_notificaciones,
  plaza,
  plazaVariables,
  subirDatos,
  subirDatosVariables,
} from '../types/apollo';
import { MARCAR_LEIDOS_PUNTO, SUBIR_DATOS } from '../utils/mutations';
import { NOTIFICACIONES_PUNTO, PLAZA } from '../utils/queries';
import { obtenerDB, obtenerDocsPrincipal } from '../utils/functions';
import { asignarPunto, modificarOnline } from '../actions';

const drawerWidth = 250;

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
    // @ts-expect-error:err
    width: theme.spacing(9),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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

export default function Dashboard(props: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element {
  const classes = useStyles();
  const { children } = props;
  const session = useSelector((state: RootState) => state.session);
  const plazaState = useSelector((state: RootState) => state.plaza);
  const plazaRefetch = useSelector((state: RootState) => state.plaza);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [noLeidos, setNoLeidos] = useState(0);
  const [notificaciones, setNotificaciones] = useState<
    NotificacionesPunto_notificacionesPunto_notificaciones_notificaciones[]
  >([]);
  const [loading, setLoading] = useState(false);
  const notificacionesRef = useRef(null);
  const [salirOpen, setSalirOpen] = useState(false);
  const [salirLoading, setSalirLoading] = useState(false);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subirConfirmationOpen, setSubirConfirmationOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [db, setDb] = useState<RxDatabase<Database.db> | null>(null);
  const [mutationVariablesDoc, setMutationVariablesDoc] = useState<RxDocument<
    Database.mutation_variables
  > | null>(null);

  const { refetch: getPlaza } = useQuery<plaza, plazaVariables>(PLAZA, {
    variables: { _id: plazaRefetch._idPunto || '' },
    skip: true,
  });

  const [subirDatosFunction, { loading: subirDatosLoading }] = useMutation<
    subirDatos,
    subirDatosVariables
  >(SUBIR_DATOS, {
    onCompleted: async (subirData) => {
      const {
        erroresIds,
        message: subirMessage,
        success: subirSuccess,
        usuario,
      } = subirData.subirDatos;
      setLoading(true);
      if (usuario && usuario.idInventario && usuario._idPunto) {
        dispatch(
          asignarPunto({
            idInventario: usuario.idInventario,
            _idPunto: usuario._idPunto,
            _idPuntoPrincipal: usuario._idPuntoPrincipal,
            infoPunto: usuario.infoPunto,
            sinAlmacen: usuario.sinAlmacen,
          })
        );
        if (subirSuccess) {
          await getPlaza({ _id: usuario._idPunto }).then(async (data) => {
            if (data.data.plaza && db && usuario?._idPunto) {
              await db.collections.plaza.upsert({
                _id: usuario._idPunto,
                ...data.data.plaza,
              });
            }
          });
          dispatch(modificarOnline(true));
          setSuccess(true);
        }
        const variables = omit(mutationVariablesDoc?.toJSON(), '_id');
        keys(variables).forEach((key) => {
          // @ts-expect-error:err
          variables[key] = variables[key].filter((v) => {
            // @ts-expect-error:err
            return erroresIds[key].includes(v._id);
          });
        });
        const m = await db?.collections.mutation_variables.upsert({
          _id: 'mutationVariables',
          ...variables,
        });
        if (m) setMutationVariablesDoc(m);

        setMessage(subirMessage);
        setLoading(false);
        setSubirConfirmationOpen(false);
      } else {
        window.location.reload();
      }
    },
  });

  const handleSubirClick = () => {
    setSubirConfirmationOpen(true);
  };
  const handleSubirClose = () => {
    if (!loading) {
      setSubirConfirmationOpen(false);
    }
  };
  useEffect(() => {
    obtenerDB(db, setDb);
  }, []);

  useEffect(() => {
    obtenerDocsPrincipal(db, session, plazaState, setMutationVariablesDoc);
  }, [db]);

  const handleSubir = async () => {
    if (mutationVariablesDoc) {
      const {
        gasto,
        intercambio,
        pago,
        venta_cliente,
        venta_punto,
      } = mutationVariablesDoc.toJSON();
      if (
        gasto.length === 0 &&
        intercambio.length === 0 &&
        pago.length === 0 &&
        venta_cliente.length === 0 &&
        venta_punto.length === 0
      ) {
        setSuccess(true);
        setMessage('Cambios subidos (0 cambios)');
        setSubirConfirmationOpen(false);
        dispatch(modificarOnline(true));
      } else {
        subirDatosFunction({
          variables: { gasto, intercambio, pago, venta_cliente, venta_punto },
        });
      }
    }
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  useQuery<NotificacionesPunto>(NOTIFICACIONES_PUNTO, {
    onCompleted: (data) => {
      if (session.nombre === 'Pasillo 2' || session.nombre === 'Pasillo 6') {
        const notificacionesArr = data.notificacionesPunto?.notificaciones?.find(
          (val) => {
            return val.nombre === session.nombre;
          }
        )?.notificaciones;
        setNotificaciones(notificacionesArr || []);
        const i = notificacionesArr?.reduce((acc, cur) => {
          if (cur.leido) {
            return acc;
          }
          return acc + 1;
        }, 0);
        setNoLeidos(i || 0);
      }
    },
    skip: !plazaState.online,
    errorPolicy: 'all',
    pollInterval: 5000,
  });

  const [marcarLeidos] = useMutation<MarcarLeidos, MarcarLeidosVariables>(
    MARCAR_LEIDOS_PUNTO,
    {
      onCompleted: (data) => {
        if (data.marcarLeidos.success) {
          setNoLeidos(0);
        }
      },
    }
  );

  const handleExit = () => {
    setSuccess(false);
    setMessage(null);
  };
  const handlenotificacionesOpen = () => {
    if (noLeidos > 0 && plazaState._idPunto) {
      marcarLeidos({ variables: { in: plazaState._idPunto } });
    }
    setOpenNotificaciones(true);
  };

  const handleActivarOffline = () => {
    dispatch(modificarOnline(false));
    localStorage.setItem('online', 'false');
    setSuccess(true);
    setMessage('Modo sin conexión activado');
  };
  const handlenotificacionesClose = () => {
    setOpenNotificaciones(false);
  };
  const handleLogout = async () => {
    setSalirLoading(true);
    setOpenNotificaciones(false);
    await auth.signOut();
    setSalirLoading(false);
  };

  const handleCancelarSalir = () => {
    setSalirOpen(false);
  };
  const handleSalirClick = () => {
    setSalirOpen(true);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <CancelDialog
        handleCancel={handleLogout}
        handleClose={handleCancelarSalir}
        loading={salirLoading}
        message="¿Desea salir de esta cuenta?"
        open={salirOpen}
      />
      <AppBar
        className={clsx(classes.appBar, open && classes.appBarShift)}
        color={
          process.env.NODE_ENV === 'development'
            ? 'secondary'
            : plazaState.online
            ? 'primary'
            : 'default'
        }
        position="absolute"
      >
        <Toolbar className={classes.toolbar} variant="dense">
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
          {!plazaState.online && (
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
          {plazaState.online && (
            <Tooltip title={<h2>Activar modo sin conexión</h2>}>
              <span>
                <IconButton
                  color="inherit"
                  disabled={!plazaState._idPunto}
                  onClick={handleActivarOffline}
                >
                  <PowerOffIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}
          {(session.nombre === 'Pasillo 2' ||
            session.nombre === 'Pasillo 6') && (
            <Tooltip title={<h2>Notificaciones</h2>}>
              <span>
                <IconButton
                  ref={notificacionesRef}
                  color="inherit"
                  disabled={!plazaState.online}
                  onClick={handlenotificacionesOpen}
                >
                  <Badge
                    badgeContent={plazaState._idPunto ? noLeidos : 0}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Tooltip title={<h2>Cerrar sesión</h2>}>
            <span>
              <IconButton
                color="inherit"
                disabled={!plazaState.online || openNotificaciones}
                onClick={handleSalirClick}
              >
                <InputIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar>
        <NotificacionesPopover
          anchorEl={notificacionesRef.current}
          notificaciones={plazaState._idPunto ? notificaciones : []}
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
        loading={loading || subirDatosLoading}
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
        <Container className={classes.container} maxWidth="xl">
          <Suspense fallback={<LinearProgress />}>{children}</Suspense>
        </Container>
      </main>
    </div>
  );
}
