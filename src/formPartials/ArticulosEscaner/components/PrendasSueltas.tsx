/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  // CircularProgress,
} from '@material-ui/core';
import { FieldArray, useFormikContext } from 'formik';
import { ClassNameMap } from '@material-ui/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { RxDocument } from 'rxdb';

import { AutocompleteFieldArray, NumberFieldArray } from '../../../components';
import { PrincipalValues } from '../../../types/types';
import * as Database from '../../../Database';
import { Casos, handleAgregarPrecio } from '../ArticulosEscaner';
import { Productos_productos_productos } from '../../../types/apollo';

interface PrendasSueltasProps {
  classes: ClassNameMap;
  maxRows?: number;
  allowZero?: boolean;
  eliminarDePrecios: (a: string, b: Casos, c: number) => void;
  incluirPrecio: boolean;
  productos: Productos_productos_productos[];
  doc?: RxDocument<Database.TicketDb>;
  docIntercambio?: RxDocument<
    Database.intercambioDB | Database.registroInventarioDB
  >;
  matches: boolean;
  esRegistro?: boolean;
}

const PrendasSueltas = (props: PrendasSueltasProps): JSX.Element => {
  const { values, errors, setFieldValue } = useFormikContext<PrincipalValues>();

  const {
    classes,
    maxRows = 20,
    allowZero,
    eliminarDePrecios,
    incluirPrecio,
    productos,
    docIntercambio,
    doc,
    matches,
    esRegistro,
  } = props;
  const name =
    docIntercambio && !esRegistro
      ? 'intercambioValues.prendasSueltas'
      : 'prendasSueltas';
  const prendasSueltas =
    docIntercambio && !esRegistro
      ? values.intercambioValues.prendasSueltas
      : values.prendasSueltas;
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <div>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            mb={1}
            mt={2}
          >
            <Box flexGrow={1}>
              <Typography
                color={errors.prendasSueltas ? 'error' : 'textSecondary'}
                variant="subtitle1"
              >
                Prendas sueltas
              </Typography>
            </Box>
            <Box>
              <Button
                aria-label="add"
                disabled={
                  values.prendasSueltas.length >= maxRows ||
                  (!doc && !docIntercambio)
                }
                onClick={async () => {
                  if (docIntercambio) {
                    await docIntercambio.atomicUpdate((oldData) => {
                      oldData.prendasSueltas.push(
                        JSON.parse(
                          JSON.stringify({ articulo: '', cantidad: 0 })
                        )
                      );
                      return oldData;
                    });
                  } else {
                    await doc?.atomicUpdate((oldData) => {
                      oldData.prendasSueltas.push(
                        JSON.parse(
                          JSON.stringify({ articulo: '', cantidad: 0 })
                        )
                      );
                      return oldData;
                    });
                  }
                  arrayHelpers.push(
                    JSON.parse(JSON.stringify({ articulo: '', cantidad: 0 }))
                  );
                }}
                size="small"
                variant="outlined"
              >
                añadir
              </Button>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box
            className={classes.box}
            height={
              matches
                ? esRegistro
                  ? '60vh'
                  : '24vh'
                : esRegistro
                ? '50vh'
                : '17vh'
            }
            maxHeight={
              matches
                ? esRegistro
                  ? '60vh'
                  : '24vh'
                : esRegistro
                ? '50vh'
                : '17vh'
            }
            overflow="auto"
          >
            <div className={classes.list}>
              <List dense disablePadding>
                {!doc && !docIntercambio ? (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Box mt={3}>
                      <CircularProgress />
                    </Box>
                  </Box>
                ) : (
                  <>
                    {prendasSueltas?.length === 0 && (
                      <Typography align="center" variant="h6">
                        Sin prendas sueltas
                      </Typography>
                    )}
                    {prendasSueltas.map((_e, index) => (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Grid
                              alignItems="center"
                              container
                              justify="space-between"
                              spacing={1}
                            >
                              <Grid item xs={4}>
                                <NumberFieldArray
                                  allowZero={allowZero}
                                  handleBlur={async (
                                    _accesor: string,
                                    val: number,
                                    _mainIndex: number,
                                    id: number
                                  ) => {
                                    if (docIntercambio) {
                                      await docIntercambio.atomicUpdate(
                                        (oldData) => {
                                          oldData.prendasSueltas[
                                            id
                                          ].cantidad = val;
                                          return oldData;
                                        }
                                      );
                                    } else {
                                      await doc?.atomicUpdate((oldData) => {
                                        oldData.prendasSueltas[
                                          id
                                        ].cantidad = val;
                                        return oldData;
                                      });
                                    }
                                  }}
                                  index={index}
                                  label="Cantidad"
                                  property="cantidad"
                                  valueName={name}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <AutocompleteFieldArray
                                  articulos
                                  getOptionLabel={(option: any) => {
                                    if (option) {
                                      if (
                                        typeof option === 'object' &&
                                        option !== null
                                      ) {
                                        return `${option.codigo}: ${option.nombre}`;
                                      }
                                      return option.split(':')[1] || option;
                                    }
                                    return '';
                                  }}
                                  handleChange={async (
                                    value: Productos_productos_productos
                                  ) => {
                                    if (docIntercambio) {
                                      await docIntercambio.atomicUpdate(
                                        (oldData) => {
                                          oldData.prendasSueltas[
                                            index
                                          ].articulo = value;
                                          return oldData;
                                        }
                                      );
                                    } else {
                                      await doc?.atomicUpdate((oldData) => {
                                        oldData.prendasSueltas[
                                          index
                                        ].articulo = value;
                                        return oldData;
                                      });
                                    }
                                    if (incluirPrecio && doc) {
                                      eliminarDePrecios(
                                        values.prendasSueltas[index].articulo
                                          .nombre,
                                        'prendasSueltas',
                                        index
                                      );
                                      handleAgregarPrecio(
                                        value.nombre,
                                        value._id,
                                        value.precio,
                                        values,
                                        setFieldValue,
                                        doc
                                      );
                                    }
                                  }}
                                  index={index}
                                  label="Artículo"
                                  options={productos}
                                  property="articulo"
                                  valueName={name}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton
                                  aria-label="delete"
                                  color="default"
                                  onClick={async () => {
                                    arrayHelpers.remove(index);
                                    if (docIntercambio) {
                                      await docIntercambio.atomicUpdate(
                                        (oldData) => {
                                          oldData.prendasSueltas.splice(
                                            index,
                                            1
                                          );
                                          return oldData;
                                        }
                                      );
                                    } else {
                                      await doc?.atomicUpdate((oldData) => {
                                        oldData.prendasSueltas.splice(index, 1);
                                        return oldData;
                                      });
                                    }
                                    if (incluirPrecio) {
                                      eliminarDePrecios(
                                        values.prendasSueltas[index].articulo
                                          .nombre,
                                        'prendasSueltas',
                                        index
                                      );
                                    }
                                  }}
                                  size="medium"
                                  tabIndex={-1}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          }
                        />
                      </ListItem>
                    ))}
                  </>
                )}
              </List>
            </div>
          </Box>
        </div>
      )}
    />
  );
};
export default PrendasSueltas;
