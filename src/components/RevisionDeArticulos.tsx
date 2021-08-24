/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Divider,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { PrendasRevision } from '../types/types';
import {
  aFormatoDeDinero,
  aFormatoDeNumero,
  montoPrendasNuevaVenta,
} from '../utils/functions';

interface RevisionDeArticulosProps {
  articulos: PrendasRevision[];
  conPrecio?: boolean;
  discrepancias?: PrendasRevision[];
}
const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0,
  },
  list: {
    flexGrow: 1,
  },
}));

const RevisionDeArticulos = (props: RevisionDeArticulosProps): JSX.Element => {
  const { articulos, discrepancias, conPrecio = false } = props;
  const classes = useStyles();

  const [total, setTotal] = useState('...');
  useEffect(() => {
    if (conPrecio) {
      // @ts-expect-error: conPrecio
      setTotal(aFormatoDeDinero(montoPrendasNuevaVenta(articulos)));
    }
  }, [articulos]);
  return (
    <>
      {discrepancias && discrepancias.length > 0 && (
        <Card elevation={4}>
          <CardHeader
            disableTypography
            title={
              <Typography color="error" variant="subtitle1">
                Discrepancias
              </Typography>
            }
          />
          <Divider />
          <CardContent className={classes.content}>
            <div className={classes.list}>
              <List dense disablePadding>
                <Box maxHeight="30vh" mb={3} overflow="auto">
                  {discrepancias.map((r, i) => (
                    <ListItem key={`art${i}`}>
                      <ListItemText
                        primary={
                          <>
                            <Typography color="error" variant="subtitle1">
                              {r.nombre}
                            </Typography>
                            {r.pqs.map((p, j) => (
                              <List dense disablePadding>
                                <ListItem key={`p${j}`}>
                                  <ListItemText
                                    primary={
                                      <Typography
                                        color="error"
                                        variant="subtitle1"
                                      >
                                        {p.id}
                                      </Typography>
                                    }
                                  />
                                </ListItem>
                              </List>
                            ))}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </Box>
              </List>
            </div>
          </CardContent>
          <Divider />
          <Divider />
        </Card>
      )}
      <Card elevation={4}>
        <CardHeader
          disableTypography
          title={<Typography variant="subtitle1">Prendas</Typography>}
        />
        <Divider />
        <CardContent className={classes.content}>
          <div className={classes.list}>
            <List dense disablePadding>
              <Box maxHeight="30vh" mb={3} overflow="auto">
                {conPrecio && (
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">
                          {`Total ${total}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
                {articulos.map((articulo) => (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <>
                            <Typography variant="subtitle1">
                              {`${articulo.nombre} (${aFormatoDeNumero(
                                articulo.c +
                                  articulo.pqs.reduce((acc, cur) => {
                                    return acc + cur.c;
                                  }, 0)
                              )})${
                                conPrecio
                                  ? `: ${aFormatoDeDinero(articulo.p || 0)}`
                                  : ''
                              }`}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="subtitle1">{`${aFormatoDeNumero(
                          articulo.c
                        )} suelta${articulo.c === 1 ? '' : 's'}`}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {articulo.pqs.map((p) => (
                      <Box ml={3}>
                        <List dense disablePadding>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1">
                                  {p.id}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Typography variant="subtitle1">
                                {aFormatoDeNumero(p.c)}
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider />
                        </List>
                      </Box>
                    ))}
                  </>
                ))}
              </Box>
            </List>
          </div>
        </CardContent>
        <Divider />
        <Divider />
      </Card>
    </>
  );
};
export default RevisionDeArticulos;
