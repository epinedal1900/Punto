import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <LocalAtmIcon />
      </ListItemIcon>
      <ListItemText primary="Nueva venta" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ListAltIcon />
      </ListItemIcon>
      <ListItemText primary="Ventas y devoluciones" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SyncAltIcon />
      </ListItemIcon>
      <ListItemText primary="Intercambios" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ViewModuleIcon />
      </ListItemIcon>
      <ListItemText primary="Inventario" />
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
