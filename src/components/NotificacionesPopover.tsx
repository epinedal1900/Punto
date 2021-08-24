/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ObjectId from 'bson-objectid';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import {
  Popover,
  Divider,
  colors,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { RootState } from '../types/store';

const dayjs = require('dayjs');

const useStyles = makeStyles((theme) => ({
  root: {
    width: 350,
    maxWidth: '100%',
  },
  actions: {
    backgroundColor: colors.grey[50],
    justifyContent: 'center',
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    },
  },
  emptyText: {
    textAlign: 'center',
    padding: theme.spacing(3),
  },
}));
interface NotificacionesPopoverProps {
  notificaciones: any[];
  anchorEl: any;
  onClose: () => void;
  open: boolean;
}
const NotificacionesPopover = (
  props: NotificacionesPopoverProps
): JSX.Element => {
  const { notificaciones, anchorEl, onClose, open } = props;

  const classes = useStyles();
  const plazaState = useSelector((state: RootState) => state.plaza);
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      onClose={onClose}
      open={open}
    >
      <div className={classes.root}>
        <Divider />
        {notificaciones.length > 0 ? (
          <List disablePadding>
            {notificaciones.map((notificacion, i) => (
              <ListItem
                key={notificacion._id}
                className={classes.listItem}
                component={RouterLink}
                divider={i < notificaciones.length - 1}
                to={`/plazas/intercambios/${plazaState._idPunto}//${notificacion._id}`}
              >
                <ListItemText
                  primary={notificacion.nombre}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary={dayjs(
                    new ObjectId(notificacion._id).getTimestamp()
                  ).format('DD/MM/YYYY-HH:mm')}
                />
                <ArrowForwardIcon />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography className={classes.emptyText} variant="h6">
            Sin notificaciones...
          </Typography>
        )}
      </div>
    </Popover>
  );
};

export default NotificacionesPopover;
