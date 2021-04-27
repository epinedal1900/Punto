import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import PrintIcon from '@material-ui/icons/Print';
import CreateIcon from '@material-ui/icons/Create';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import { Link as RouterLink } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem button component={RouterLink} to="/">
      <ListItemIcon>
        <LocalAtmIcon />
      </ListItemIcon>
      <ListItemText primary="Principal" />
    </ListItem>
    <ListItem button component={RouterLink} to="/movimientos">
      <ListItemIcon>
        <ListAltIcon />
      </ListItemIcon>
      <ListItemText primary="Movimientos" />
    </ListItem>
    <ListItem button component={RouterLink} to="/gastos">
      <ListItemIcon>
        <MonetizationOnOutlinedIcon />
      </ListItemIcon>
      <ListItemText primary="Gastos" />
    </ListItem>
    <ListItem button component={RouterLink} to="/registroinventario">
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary="Registro de inventarío" />
    </ListItem>
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
);

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
