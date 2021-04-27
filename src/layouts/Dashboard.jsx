/* eslint-disable react/no-multi-comp */
import React, { Suspense, useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useQuery, useMutation } from '@apollo/client';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { LinearProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { mainListItems } from '../components/listItems';
import NotificacionesPopover from '../components/NotificacionesPopover';
import { NOTIFICACIONES_PUNTO } from '../utils/queries';
import { MARCAR_LEIDOS_PUNTO } from '../utils/mutations';

import { auth } from '../firebase';

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
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
  const [open, setOpen] = React.useState(true);
  const [noLeidos, setNoLeidos] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const notificacionesRef = useRef(null);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    auth.signOut();
  };

  useQuery(NOTIFICACIONES_PUNTO, {
    onCompleted: (data) => {
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
    },
    pollInterval: 5000,
  });

  const [marcarLeidos] = useMutation(MARCAR_LEIDOS_PUNTO, {
    onCompleted: (data) => {
      if (data.marcarLeidos.success === true) {
        setNoLeidos(0);
      }
    },
  });

  const handlenotificacionesOpen = () => {
    if (noLeidos > 0) {
      marcarLeidos({ variables: { nombre: session.nombre } });
    }
    setOpenNotificaciones(true);
  };

  const handlenotificacionesClose = () => {
    setOpenNotificaciones(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, open && classes.appBarShift)}
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
          <IconButton
            ref={notificacionesRef}
            color="inherit"
            onClick={handlenotificacionesOpen}
          >
            <Badge badgeContent={noLeidos} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <InputIcon />
          </IconButton>
        </Toolbar>
        <NotificacionesPopover
          anchorEl={notificacionesRef.current}
          notificaciones={notificaciones}
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
        <List>{mainListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.container}>
          <Suspense fallback={<LinearProgress />}>{children}</Suspense>
        </Container>
      </main>
    </div>
  );
}
