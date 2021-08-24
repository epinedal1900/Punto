import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import List from '@material-ui/core/List';
import PrintIcon from '@material-ui/icons/Print';
import CreateIcon from '@material-ui/icons/Create';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../types/store';

export const ListItems = () => {
  const plazaState = useSelector((state: RootState) => state.plaza);
  const history = useHistory();

  return (
    <List>
      <div>
        <ListItem
          button
          onClick={() => {
            if (history.location.pathname !== '/') {
              history.push('/');
            }
          }}
        >
          <ListItemIcon>
            <LocalAtmIcon />
          </ListItemIcon>
          <ListItemText primary="Principal" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          disabled={!plazaState._idPunto}
          to={`/plazas/ver/${plazaState._idPunto}`}
        >
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Plaza activa" />
        </ListItem>
        {!plazaState.sinAlmacen && (
          <>
            <ListItem
              button
              component={RouterLink}
              disabled={!plazaState._idPunto}
              to="/calendario"
            >
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Calendario de registros" />
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              disabled={!plazaState._idPunto}
              to="/registroinventario"
            >
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="Registro de inventario" />
            </ListItem>
          </>
        )}
        <ListItem button component={RouterLink} to="/articulos">
          <ListItemIcon>
            <ViewModuleIcon />
          </ListItemIcon>
          <ListItemText primary="Artículos" />
        </ListItem>
        <ListItem button component={RouterLink} to="/impresoras">
          <ListItemIcon>
            <PrintIcon />
          </ListItemIcon>
          <ListItemText primary="Impresoras" />
        </ListItem>
      </div>
    </List>
  );
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
