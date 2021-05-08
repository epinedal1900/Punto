/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ObjectId from 'bson-objectid';
import { makeStyles } from '@material-ui/core/styles';

import {
  Popover,
  CardHeader,
  Divider,
  colors,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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

const NotificacionesPopover = (props) => {
  const { notificaciones, anchorEl, ...rest } = props;

  const classes = useStyles();

  return (
    <Popover
      {...rest}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
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
                to={`/movimientos/${notificacion._id}`}
              >
                <ListItemText
                  primary={notificacion.nombre}
                  primaryTypographyProps={{ variant: 'body1' }}
                  secondary={dayjs(
                    ObjectId(notificacion._id).getTimestamp()
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
